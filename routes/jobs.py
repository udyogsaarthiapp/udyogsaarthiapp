from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import os
import json

from routes.db import db, Job, Application, User
from routes.auth import send_email

jobs_bp = Blueprint("jobs", __name__)

# Dummy jobs kept in-memory for now (UI) — DB is optional and used when configured
jobs = [
    {"id": 1, "title": "Data Entry Operator", "company": "ABC Pvt Ltd", "disabilityFriendly": True},
    {"id": 2, "title": "Software Intern", "company": "XYZ Tech", "disabilityFriendly": False}
]


@jobs_bp.route("/", methods=["GET"])
def get_jobs():
    # If DB present, return DB jobs, otherwise return in-memory jobs
    try:
        if db and db.engine:
            db_jobs = Job.query.all()
            if db_jobs:
                return jsonify({"status": "success", "message": "Jobs fetched", "data": [j.to_dict() for j in db_jobs]})
    except Exception:
        pass
    return jsonify({"status": "success", "message": "Jobs fetched", "data": jobs})


@jobs_bp.route("/add", methods=["POST"])
@jwt_required()
def add_job():
    claims = get_jwt()
    if claims.get("role") != "employer":
        return jsonify({"status": "error", "message": "Only employers can post jobs"}), 403
    
    data = request.get_json()
    new_job = {"id": len(jobs)+1, "title": data["title"], "company": data.get("company"), "disabilityFriendly": data.get("disabilityFriendly", False)}
    jobs.append(new_job)

    # If DB is configured, also persist a Job record (best-effort)
    try:
        if db and db.engine:
            job_row = Job(title=new_job["title"], company=new_job.get("company"), description=data.get("description", ""), type=data.get("type", "job"))
            db.session.add(job_row)
            db.session.commit()
            return jsonify({"status": "success", "message": "Job added", "data": job_row.to_dict()})
    except Exception:
        pass

    return jsonify({"status": "success", "message": "Job added", "data": new_job})


@jobs_bp.route("/apply/<int:job_id>", methods=["POST"])
@jwt_required()
def apply_job(job_id):
    claims = get_jwt()
    if claims.get("role") != "jobseeker":
        return jsonify({"status": "error", "message": "Only jobseekers can apply"}), 403

    # identity stored as string in token
    user_id = get_jwt_identity()

    # Attempt to find user email from users.json (auth still uses users.json)
    user_email = None
    user_name = None
    try:
        users_file = os.path.join(os.path.dirname(__file__), "users.json")
        if os.path.exists(users_file):
            with open(users_file, "r") as f:
                users = json.load(f)
            user = next((u for u in users if str(u.get("id")) == str(user_id)), None)
            if user:
                user_email = user.get("email")
                user_name = user.get("name")
    except Exception:
        pass

    # Try to persist application in DB if configured
    applied = False
    try:
        if db and db.engine:
            # Ensure job exists in DB; create from in-memory if missing
            job_row = Job.query.get(job_id)
            if not job_row:
                inmem = next((j for j in jobs if int(j.get("id")) == int(job_id)), None)
                if inmem:
                    job_row = Job(title=inmem.get("title"), company=inmem.get("company"), description=inmem.get("description", ""), type=inmem.get("type", "job"))
                    db.session.add(job_row)
                    db.session.commit()

            # find or create user row (best-effort). We do NOT change auth flow — just mirror if possible
            user_row = None
            if user_email:
                user_row = User.query.filter_by(email=user_email).first()
                if not user_row:
                    try:
                        # create light user mirror
                        user_row = User(id=int(user_id), name=user_name or "", email=user_email, role=claims.get("role") or "jobseeker")
                        db.session.add(user_row)
                        db.session.commit()
                    except Exception:
                        db.session.rollback()

            # record application
            app_row = Application(user_id=int(user_id), job_id=job_row.id if job_row else job_id)
            db.session.add(app_row)
            # increment counters
            if job_row:
                job_row.apply_count = (job_row.apply_count or 0) + 1
            if user_row:
                user_row.applied_count = (user_row.applied_count or 0) + 1
            db.session.commit()
            applied = True
    except Exception as e:
        try:
            db.session.rollback()
        except Exception:
            pass

    # Send confirmation email (best-effort). Use email found from users.json if available.
    if user_email:
        try:
            send_email(
                user_email,
                "Application Received - Udyog Saarthi",
                f"Hello {user_name or 'Applicant'},\n\nWe have received your application for job/training id {job_id}. Our team will review and contact you if you are shortlisted.\n\nThank you for using Udyog Saarthi."
            )
        except Exception as e:
            print(f"Failed sending application email: {e}")

    if applied:
        return jsonify({"status": "success", "message": f"Application recorded for user {user_id} on job {job_id}"})

    # Fallback behavior (no DB) — just respond and still attempt to send email if possible
    return jsonify({"status": "success", "message": f"User {user_id} applied for job {job_id}"})
