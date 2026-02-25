from flask import Blueprint, jsonify
from .models import AQIPrediction, AQIHourlyAvg, PollutionSource

api = Blueprint('api', __name__)


# =====================
# Hourly AQI Graph API
# =====================
@api.route('/aqi/hourly')
def hourly_aqi():

    data = AQIHourlyAvg.query.all()

    result = []

    for row in data:
        result.append({
            "datetime": row.datetime,
            "hour": row.hour,
            "aqi": row.average_aqi
        })

    return jsonify(result)


# =====================
# Station Predictions
# =====================
@api.route('/aqi/stations')
def station_aqi():

    data = AQIPrediction.query.all()

    result = []

    for row in data:
        result.append({
            "station": row.station,
            "city": row.city,
            "datetime": row.datetime,
            "hour": row.hour,
            "aqi": row.predicted_aqi
        })

    return jsonify(result)


# =====================
# Pollution Sources
# =====================
@api.route('/sources')
def sources():

    data = PollutionSource.query.all()

    result = []

    for row in data:
        result.append({
            "datetime": row.datetime,
            "city": row.city,
            "station": row.station,
            "dominant_pollutant": row.dominant_pollutant,
            "percent": row.dominant_percent
        })

    return jsonify(result)