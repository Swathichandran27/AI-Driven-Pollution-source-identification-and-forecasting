
from flask import Blueprint, request, jsonify
from app import db
from app.models import AQIPrediction, PollutionSource
from sqlalchemy import func

policy_bp = Blueprint('policy', __name__, url_prefix='/api/policy')


# ==============================
# 1. POLICY OVERVIEW DASHBOARD
# ==============================

# Average AQI
@policy_bp.route('/overview/average-aqi', methods=['GET'])
def average_aqi():

    avg_aqi = db.session.query(
        func.avg(AQIPrediction.predicted_aqi)
    ).scalar()

    return jsonify({
        "average_aqi": round(avg_aqi or 0,2)
    })


# Worst Station
@policy_bp.route('/overview/worst-station', methods=['GET'])
def worst_station():

    worst = AQIPrediction.query.order_by(
        AQIPrediction.predicted_aqi.desc()
    ).first()

    if not worst:
        return jsonify({})

    return jsonify({
        "station": worst.station,
        "city": worst.city,
        "aqi": worst.predicted_aqi
    })


# Dominant Source Summary
@policy_bp.route('/overview/dominant-source', methods=['GET'])
def dominant_source():

    sources = db.session.query(
        func.avg(PollutionSource.vehicles),
        func.avg(PollutionSource.industry),
        func.avg(PollutionSource.dust),
        func.avg(PollutionSource.biomass)
    ).first()

    return jsonify({
        "traffic": round(sources[0] or 0,2),
        "industry": round(sources[1] or 0,2),
        "dust": round(sources[2] or 0,2),
        "biomass": round(sources[3] or 0,2)
    })


# High Risk Zones
@policy_bp.route('/overview/high-risk-zones', methods=['GET'])
def high_risk_zones():

    zones = AQIPrediction.query.filter(
        AQIPrediction.predicted_aqi > 250
    ).all()

    result = []

    for z in zones:
        result.append({
            "station": z.station,
            "city": z.city,
            "aqi": z.predicted_aqi
        })

    return jsonify(result)


# Severe Alerts
@policy_bp.route('/overview/alerts', methods=['GET'])
def severe_alerts():

    alerts = AQIPrediction.query.filter(
        AQIPrediction.predicted_aqi > 300
    ).all()

    result = []

    for a in alerts:
        result.append({
            "station": a.station,
            "city": a.city,
            "aqi": a.predicted_aqi,
            "level": "Severe"
        })

    return jsonify(result)


# ==============================
# 2. SOURCE IDENTIFICATION PAGE
# ==============================

@policy_bp.route('/source-identification', methods=['GET'])
def source_identification():

    station = request.args.get('location')
    date = request.args.get('date')

    source = PollutionSource.query.filter_by(
        station=station
    ).order_by(
        PollutionSource.datetime.desc()
    ).first()

    if not source:
        return jsonify({})

    contributions = {
        "traffic": source.traffic,
        "industry": source.industry,
        "dust": source.dust,
        "biomass": source.biomass
    }

    dominant = max(contributions, key=contributions.get)

    return jsonify({

        "location": station,
        "date": source.datetime,

        "dominant_source": dominant,

        "contributions": contributions,

        "ai_explanation":
        f"{dominant} is the major contributor at {station}.",

        "satellite":
        "ISRO pollution observation reference"
    })


# ==============================
# 3. FORECAST PAGE
# ==============================

@policy_bp.route('/forecast', methods=['GET'])
def forecast():

    station = request.args.get('location')

    predictions = AQIPrediction.query.filter_by(
        station=station
    ).order_by(
        AQIPrediction.datetime
    ).limit(7).all()

    result = []

    for p in predictions:

        result.append({

            "date": p.datetime,
            "aqi": p.predicted_aqi,
            "confidence": 0.87
        })

    peak = max(result, key=lambda x: x["aqi"]) if result else None

    return jsonify({

        "location": station,

        "forecast": result,

        "expected_peak": peak,

        "trend": "increasing"
    })


# ==============================
# 4. POLICY RECOMMENDATIONS
# ==============================

@policy_bp.route('/recommendations', methods=['GET'])
def recommendations():

    station = request.args.get('location')

    avg_aqi = db.session.query(
        func.avg(AQIPrediction.predicted_aqi)
    ).scalar()

    return jsonify({

        "location": station,

        "recommendations":[

            {

            "policy":"Traffic Control",

            "expected_impact":"Reduce AQI by 20%",

            "before_aqi":round(avg_aqi or 0),

            "after_aqi":round((avg_aqi or 0)*0.8),

            "explanation":
            "Reducing vehicle movement lowers PM2.5"
            },

            {

            "policy":"Industrial Regulation",

            "expected_impact":"Reduce AQI by 10%",

            "before_aqi":round(avg_aqi or 0),

            "after_aqi":round((avg_aqi or 0)*0.9),

            "explanation":
            "Industrial emission control reduces NOx and SO2"
            }

        ]
    })