import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Gmail SMTP config
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'preethaguha60@gmail.com'  # Replace with your Gmail address
EMAIL_HOST_PASSWORD = 'qwqr zwje dnmu mokq'  # Replace with your Gmail App Password
EMAIL_FROM = EMAIL_HOST_USER

def send_email(to_email, subject, body):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_FROM
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    try:
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
        server.sendmail(EMAIL_FROM, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Email send failed: {e}")

import json
import os
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity, get_jwt

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()
jwt = JWTManager()

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

# ...existing code...

## removed earlier misplaced update route; replaced later to avoid blueprint reinit issues


import json
import os
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()
jwt = JWTManager()

USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def load_users():
    if not os.path.exists(USERS_FILE):
        # Create file with default users
        default_users = [
            {"id": 1, "name": "Preetha", "email": "preetha@example.com", "password": bcrypt.generate_password_hash("123456").decode("utf-8"), "role": "jobseeker"},
            {"id": 2, "name": "Employer Ltd", "email": "employer@example.com", "password": bcrypt.generate_password_hash("employer123").decode("utf-8"), "role": "employer"}
        ]
        with open(USERS_FILE, "w") as f:
            json.dump(default_users, f)
        return default_users
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

def get_next_id(users):
    return max([u["id"] for u in users], default=0) + 1


@auth_bp.record_once
def init_jwt(state):
    app = state.app
    app.config["JWT_SECRET_KEY"] = "mysecretkey123"
    jwt.init_app(app)

    # JWT error handlers to return consistent JSON and 401 codes
    @jwt.unauthorized_loader
    def handle_missing_token(reason):
        return jsonify({"status": "error", "message": f"Unauthorized: {reason}"}), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(reason):
        return jsonify({"status": "error", "message": f"Invalid token: {reason}"}), 401

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        return jsonify({"status": "error", "message": "Token has expired"}), 401

    @jwt.needs_fresh_token_loader
    def handle_fresh_token_required():
        return jsonify({"status": "error", "message": "Fresh token required"}), 401

    @jwt.revoked_token_loader
    def handle_revoked_token(jwt_header, jwt_payload):
        return jsonify({"status": "error", "message": "Token has been revoked"}), 401

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    users = load_users()
    if any(u["email"] == data["email"] for u in users):
        return jsonify({"status": "error", "message": "User already exists"}), 400
    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    new_user = {"id": get_next_id(users), "name": data["name"], "email": data["email"], "password": hashed_pw, "role": data["role"]}
    users.append(new_user)
    save_users(users)
    # Send signup email
    send_email(
        new_user["email"],
        "Welcome to Udyog Saarthi!",
        f"Hello {new_user['name']},\n\nYour account has been created successfully.\n\nThank you for registering!"
    )
    return jsonify({"status": "success", "message": "User registered", "data": {"id": new_user["id"], "email": new_user["email"], "role": new_user["role"]}})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    users = load_users()
    user = next((u for u in users if u["email"] == data["email"]), None)
    if not user or not bcrypt.check_password_hash(user["password"], data["password"]):
        return jsonify({"status": "error", "message": "Invalid credentials"}), 400
    # Use string identity for 'sub' claim (PyJWT requires subject to be a string)
    # Add role as an additional claim
    token = create_access_token(identity=str(user["id"]), additional_claims={"role": user["role"]})
    # Send login email
    send_email(
        user["email"],
        "Login Alert - Udyog Saarthi",
        f"Hello {user['name']},\n\nYou have successfully logged in to your account.\n\nIf this wasn't you, please reset your password."
    )
    return jsonify({"status": "success", "message": "Login successful", "data": {"token": token, "role": user["role"]}})

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    identity = get_jwt_identity()  # string user id
    users = load_users()
    user = next((u for u in users if u["id"] == int(identity)), None)
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404
    user_data = {k: v for k, v in user.items() if k != "password"}
    return jsonify({"status": "success", "data": user_data})

# Re-add the update route once after all helpers are defined
@auth_bp.route("/update", methods=["OPTIONS", "POST"], strict_slashes=False)
def update_profile_entry():
    if request.method == "OPTIONS":
        return ("", 204)
    # Use a nested function with the jwt_required decorator to avoid double registration issues
    @jwt_required()
    def _update_impl():
        identity = get_jwt_identity()
        data = request.get_json()
        users = load_users()
        user = next((u for u in users if u["id"] == int(identity)), None)
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404
        if "email" in data and any(u["email"] == data["email"] and u["id"] != user["id"] for u in users):
            return jsonify({"status": "error", "message": "Email already in use"}), 400
        try:
            if "name" in data:
                user["name"] = str(data["name"]) if data["name"] is not None else user.get("name", "")
            if "email" in data:
                user["email"] = str(data["email"]) if data["email"] is not None else user.get("email", "")
            if "disabilityType" in data:
                user["disabilityType"] = str(data["disabilityType"]) if data["disabilityType"] is not None else ""
            if "skills" in data:
                skills_val = data["skills"]
                if isinstance(skills_val, str):
                    user["skills"] = [s.strip() for s in skills_val.split(",") if s and s.strip()]
                elif isinstance(skills_val, list):
                    user["skills"] = [str(s).strip() for s in skills_val if str(s).strip()]
                elif skills_val is None:
                    user["skills"] = []
            if "experience" in data:
                user["experience"] = str(data["experience"]) if data["experience"] is not None else ""
            if "location" in data:
                user["location"] = str(data["location"]) if data["location"] is not None else ""
            if "phone" in data:
                user["phone"] = str(data["phone"]) if data["phone"] is not None else ""
            if "bio" in data:
                user["bio"] = str(data["bio"]) if data["bio"] is not None else ""
            save_users(users)
        except Exception as e:
            return jsonify({"status": "error", "message": f"Failed to update profile: {e}"}), 500
        user_data = {k: v for k, v in user.items() if k != "password"}
        return jsonify({"status": "success", "message": "Profile updated", "data": user_data})

    return _update_impl()
