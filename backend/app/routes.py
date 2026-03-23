from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from .models import AQIPrediction, AQIHourlyAvg, PollutionSource, User
from . import db

api = Blueprint('api', __name__)


# =====================
# 🔐 AUTH APIs
# =====================

@api.route('/signup', methods=['POST'])
def signup():
    data = request.json

    # check if user exists
    existing_user = User.query.filter_by(email=data.get("email")).first()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    # create new user
    new_user = User(
        name=data.get("name"),
        email=data.get("email"),
        password=generate_password_hash(data.get("password")),
        role=data.get("role")  # citizen / policymaker
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.json

    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not check_password_hash(user.password, data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    })


# =====================
# 📊 Hourly AQI Graph API
# =====================

@api.route('/aqi/hourly')
def hourly_aqi():

    data = AQIHourlyAvg.query.all()

    result = []

    for row in data:
        result.append({
            "datetime": str(row.datetime),
            "hour": row.hour,
            "aqi": row.average_aqi
        })

    return jsonify(result)


# =====================
# 📍 Station Predictions
# =====================

@api.route('/aqi/stations')
def station_aqi():

    data = AQIPrediction.query.all()

    result = []

    for row in data:
        result.append({
            "station": row.station,
            "city": row.city,
            "datetime": str(row.datetime),
            "hour": row.hour,
            "aqi": row.predicted_aqi
        })

    return jsonify(result)


# =====================
# 🌫️ Pollution Sources
# =====================

@api.route('/sources')
def sources():

    data = PollutionSource.query.all()

    result = []

    for row in data:
        result.append({
            "datetime": str(row.datetime),
            "city": row.city,
            "station": row.station,
            "dominant_pollutant": row.dominant_pollutant,
            "percent": row.dominant_percent
        })

    return jsonify(result)