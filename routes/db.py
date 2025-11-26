import os
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    role = db.Column(db.String(50), nullable=False)
    applied_count = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email, "role": self.role, "applied_count": self.applied_count}


class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    company = db.Column(db.String(200))
    description = db.Column(db.Text)
    type = db.Column(db.String(50), default='job')
    apply_count = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {"id": self.id, "title": self.title, "company": self.company, "description": self.description, "type": self.type, "apply_count": self.apply_count}


class Application(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"id": self.id, "user_id": self.user_id, "job_id": self.job_id, "created_at": self.created_at.isoformat()}
