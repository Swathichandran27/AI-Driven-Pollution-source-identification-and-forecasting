from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(BASE_DIR, '..', 'instance', 'database.db')
db = SQLAlchemy()

def create_app():

    app = Flask(__name__)

    # SQLite Database (absolute path)
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Import routes AFTER db init
    from app.routes import api

    # Register Blueprint
    app.register_blueprint(api)

    return app