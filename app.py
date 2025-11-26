import os
from flask import Flask, jsonify, request
from flask_cors import CORS

# Database configuration: prefer env var (MySQL or other SQLAlchemy URL). If not provided,
# fall back to a local SQLite file so you don't need to run a separate MySQL server.
DATABASE_URL = os.environ.get("DATABASE_URL") or os.environ.get("MYSQL_URI")
if not DATABASE_URL:
    # Use a file-based SQLite DB inside the backend project for zero-config setup
    basedir = os.path.dirname(__file__)
    sqlite_path = os.path.join(basedir, "udyog_saarthi.db")
    DATABASE_URL = f"sqlite:///{sqlite_path}"

app = Flask(__name__)
# CORS: explicitly allow Authorization header and common methods for frontend app
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
    allow_headers="*",
    expose_headers=["Authorization"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    max_age=600
)

# Import routes
from routes.auth import auth_bp
from routes.jobs import jobs_bp
from routes.coaching import coaching_bp
from routes.db import db as _db

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(jobs_bp, url_prefix="/api/jobs")
app.register_blueprint(coaching_bp, url_prefix="/api/coaching")

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
_db.init_app(app)
# create tables if they don't exist
with app.app_context():
    try:
        _db.create_all()
        print("Database tables ensured (create_all)")
        print(f"Using DATABASE_URL={DATABASE_URL}")

        # Seed the jobs table with more sample jobs/trainings if empty.
        # This is a no-op when the table already has rows.
        try:
            from routes.db import Job
            if Job.query.count() == 0:
                sample_seed = [
                    {"title": "Senior Accessibility Developer", "company": "Tech Solutions Inc.", "description": "Lead development of accessible web applications following WCAG 2.1 AA standards.", "type": "job"},
                    {"title": "Web Accessibility Training Program", "company": "National Skill Development Corporation", "description": "Comprehensive 3-month certification program covering web accessibility standards and assistive technologies.", "type": "training"},
                    {"title": "Inclusive UX Designer", "company": "Innovate Digital Labs", "description": "Design inclusive user experiences for mobile and web applications with focus on accessibility and usability.", "type": "job"},
                    {"title": "Data Entry Operator", "company": "ABC Pvt Ltd", "description": "Accurate data entry and record keeping. Suitable for entry-level candidates.", "type": "job"},
                    {"title": "Software Intern", "company": "XYZ Tech", "description": "Internship for software development and testing.", "type": "job"},
                    {"title": "Assistive Technology Specialist", "company": "EnableTech", "description": "Support users with assistive technologies and ensure product compatibility.", "type": "job"},
                    {"title": "Vocational Training - Carpentry", "company": "SkillBuild Trust", "description": "Hands-on carpentry training tailored for persons with disabilities.", "type": "training"},
                    {"title": "Digital Marketing for Accessibility", "company": "MarketInclusiv", "description": "Training program on inclusive digital marketing practices.", "type": "training"},
                    {"title": "Customer Support Executive (Accessible Services)", "company": "CareCo", "description": "Provide empathetic customer support via phone and chat with accessibility accommodations.", "type": "job"},
                    {"title": "Mobile App Accessibility Bootcamp", "company": "AppWorks Academy", "description": "Short bootcamp covering mobile accessibility testing and remediation.", "type": "training"}
                ]
                for s in sample_seed:
                    j = Job(title=s["title"], company=s.get("company"), description=s.get("description", ""), type=s.get("type", "job"))
                    _db.session.add(j)
                _db.session.commit()
                print(f"Seeded {len(sample_seed)} jobs/trainings into the database")
        except Exception as e:
            print(f"Seeding skipped or failed: {e}")

    except Exception as e:
        print(f"Could not create tables: {e}")

@app.route("/")
def home():
    return jsonify({"status": "success", "message": "Udyog Saarthi Backend is running 🚀"})

# Ensure all /api/* OPTIONS preflights return quickly with OK
@app.before_request
def handle_options_preflight():
    if request.method == "OPTIONS" and request.path.startswith("/api/"):
        return ("", 204)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
