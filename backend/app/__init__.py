from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()

db = SQLAlchemy()

def create_app():

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    instance_path = os.path.join(BASE_DIR, "..", "instance")
    os.makedirs(instance_path, exist_ok=True)

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

    # Enable CORS (React → Flask)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

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

    app.register_blueprint(api)
    app.register_blueprint(policy_bp)
    app.register_blueprint(citizen_bp)

    # =========================
    # CREATE TABLES
    # =========================

    with app.app_context():
        db.create_all()

    return app