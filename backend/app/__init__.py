from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()

def create_app():

    # Base project directory
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    # Instance folder (Flask standard location for DB)
    instance_path = os.path.join(BASE_DIR, "..", "instance")
    os.makedirs(instance_path, exist_ok=True)

    # Database path
    db_path = os.path.join(instance_path, "database.db")

    app = Flask(
        __name__,
        instance_path=instance_path,
        instance_relative_config=True
    )

    # =========================
    # CONFIG
    # =========================

    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Enable CORS for frontend
    CORS(app)

    # Initialize database
    db.init_app(app)

    # =========================
    # IMPORT BLUEPRINTS
    # =========================

    from app.routes import api
    from app.policy_routes import policy_bp
    from app.citizen_routes import citizen_bp

    # =========================
    # REGISTER BLUEPRINTS
    # =========================

    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(policy_bp, url_prefix="/policy")
    app.register_blueprint(citizen_bp, url_prefix="/citizen")

    # =========================
    # CREATE TABLES (optional)
    # =========================

    with app.app_context():
        db.create_all()

    return app