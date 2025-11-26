from flask import Blueprint, jsonify

coaching_bp = Blueprint("coaching", __name__)

coaching = [
    {"id": 1, "title": "Soft Skills Training", "provider": "SkillUp Center"},
    {"id": 2, "title": "Technical Bootcamp", "provider": "Tech4All"}
]

@coaching_bp.route("/", methods=["GET"])
def get_coaching():
    return jsonify({"status": "success", "message": "Coaching programs fetched", "data": coaching})
