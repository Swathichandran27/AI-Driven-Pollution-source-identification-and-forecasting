from flask import Blueprint, request, jsonify
from app import db
from app.models import AQIPrediction, PollutionSource
from sqlalchemy import func
from groq import Groq
import os
import json

policy_bp = Blueprint('policy', __name__, url_prefix='/api/policy')


# ==============================
# 1. POLICY OVERVIEW DASHBOARD
# ==============================
@policy_bp.route('/overview/dashboard', methods=['GET'])
def overview_dashboard():

    # ✅ AVG AQI
    avg_aqi = db.session.query(func.avg(AQIPrediction.predicted_aqi)).scalar() or 0

    # ✅ WORST STATION
    worst = AQIPrediction.query.order_by(
        AQIPrediction.predicted_aqi.desc()
    ).first()

    # ✅ SOURCE AVG
    sources = db.session.query(
        func.avg(PollutionSource.vehicles),
        func.avg(PollutionSource.industry),
        func.avg(PollutionSource.dust),
        func.avg(PollutionSource.biomass)
    ).first()

    src = {
        "Traffic":  round(sources[0] or 0, 1),
        "Industry": round(sources[1] or 0, 1),
        "Dust":     round(sources[2] or 0, 1),
        "Biomass":  round(sources[3] or 0, 1)
    }

    dominant_source = max(src, key=src.get) if src else "Unknown"

    # HIGH RISK ZONES — top 15 unique stations by max AQI
    zone_rows = db.session.query(
        AQIPrediction.station,
        func.max(AQIPrediction.predicted_aqi)
    ).group_by(
        AQIPrediction.station
    ).order_by(
        func.max(AQIPrediction.predicted_aqi).desc()
    ).limit(15).all()

    high_risk = [{
        "name": z[0],
        "aqi": round(z[1]),
        "trend": "↑ Rising"
    } for z in zone_rows]

    # ALERTS — stations above AQI 300
    alert_rows = db.session.query(
        AQIPrediction.station,
        func.max(AQIPrediction.predicted_aqi)
    ).group_by(
        AQIPrediction.station
    ).having(
        func.max(AQIPrediction.predicted_aqi) > 300
    ).order_by(
        func.max(AQIPrediction.predicted_aqi).desc()
    ).limit(5).all()

    alerts = [{
        "area": a[0],
        "message": f"AQI {round(a[1])} — Severe pollution level",
        "time": "Recently"
    } for a in alert_rows]

    # TREND: flat hourly average across all stations
    trend_rows = db.session.query(
        AQIPrediction.datetime,
        func.avg(AQIPrediction.predicted_aqi)
    ).group_by(
        AQIPrediction.datetime
    ).order_by(
        AQIPrediction.datetime
    ).limit(24).all()

    trend = [{"date": str(r[0]), "aqi": round(r[1], 1)} for r in trend_rows]

    return jsonify({
        "stats": {
            "avgAQI": round(avg_aqi, 1),
            "worstStation": worst.station if worst else "",
            "worstAQI": round(worst.predicted_aqi) if worst else 0,
            "dominantSource": dominant_source,
            "dominantPercentage": src.get(dominant_source, 0),
            "highRiskZones": len(high_risk),
            "activeAlerts": len(alerts),
            "forecast24": round(avg_aqi * 1.05, 1),
            "forecast72": round(avg_aqi * 1.10, 1)
        },
        "sources": [{"name": k, "value": v} for k, v in src.items()],
        "high_risk_zones": high_risk,
        "alerts": alerts,
        "trend": trend
    })
# ==============================
# 2. SOURCE IDENTIFICATION
# ==============================

@policy_bp.route('/stations', methods=['GET'])
def get_stations():
    stations = db.session.query(
        PollutionSource.station
    ).distinct().order_by(
        PollutionSource.station
    ).all()

    return jsonify([s[0] for s in stations])


@policy_bp.route('/source-identification', methods=['GET'])
def source_identification():

    station = request.args.get('location')

    source = PollutionSource.query.filter(
        PollutionSource.station.ilike(f"%{station}%")
    ).order_by(
        PollutionSource.datetime.desc()
    ).first()

    if not source:
        return jsonify({
            "location": station,
            "dominant_source": None,
            "contributions": {},
            "ai_explanation": "No data available"
        })

    contributions = {
        "traffic": round(source.vehicles or 0, 2),
        "industry": round(source.industry or 0, 2),
        "dust": round(source.dust or 0, 2),
        "biomass": round(source.biomass or 0, 2)
    }

    dominant = max(contributions, key=contributions.get)

    explanation_map = {
        "traffic": f"Vehicles contribute {contributions['traffic']}% — highest among all sources. High NO2 and CO indicate heavy vehicular emissions.",
        "industry": f"Industry contributes {contributions['industry']}% — major source of SO2 and NOx emissions.",
        "dust": f"Dust contributes {contributions['dust']}% — road dust and construction activity raising PM10 levels.",
        "biomass": f"Biomass burning contributes {contributions['biomass']}% — crop residue or waste burning detected."
    }

    return jsonify({
        "location": station,
        "date": str(source.datetime),
        "dominant_pollutant": source.dominant_pollutant,
        "dominant_source": dominant,
        "contributions": contributions,
        "ai_explanation": explanation_map.get(dominant, "No explanation available."),
        "satellite": "ISRO pollution observation reference"
    })


# ==============================
# 3. FORECAST (REAL + PREDICTED)
# ==============================

@policy_bp.route('/forecast', methods=['GET'])
def forecast():

    station = request.args.get('location')

    print("Station from API:", station)

    # TODAY (REAL DATA)
    today_source = PollutionSource.query.filter(
        PollutionSource.station.ilike(f"%{station}%")
    ).order_by(
        PollutionSource.datetime.desc()
    ).first()

    # FUTURE (PREDICTION)
    predictions = AQIPrediction.query.filter(
        AQIPrediction.station.ilike(f"%{station}%")
    ).order_by(
        AQIPrediction.datetime
    ).limit(24).all()

    if not today_source and not predictions:
        return jsonify({
            "location": station,
            "forecast": [],
            "expected_peak": None,
            "trend": "no-data"
        })

    result = []

    # REAL AQI (WEIGHTED)
    if today_source:
        today_aqi = (
            (today_source.vehicles ) * 0.4 +
            (today_source.industry ) * 0.3 +
            (today_source.dust) * 0.2 +
            (today_source.biomass) * 0.1
        )

        today_aqi = min(max(today_aqi, 0), 500)

        result.append({
            "date": str(today_source.datetime),
            "aqi": round(today_aqi, 1),
            "confidence": 1.0,
            "type": "actual"
        })

    # PREDICTED AQI
    for p in predictions:
        result.append({
            "date": str(p.datetime),
            "aqi": p.predicted_aqi,
            "confidence": 0.87,
            "type": "predicted"
        })

    # PEAK
    peak = max(result, key=lambda x: x["aqi"])

    # TREND
    trend = "stable"
    if len(result) >= 2:
        if result[1]["aqi"] > result[0]["aqi"]:
            trend = "increasing"
        elif result[1]["aqi"] < result[0]["aqi"]:
            trend = "decreasing"

    return jsonify({
        "location": station,
        "forecast": result,
        "expected_peak": peak,
        "trend": trend
    })


# ==============================
# 4. POLICY RECOMMENDATIONS
# ==============================

@policy_bp.route('/recommendations', methods=['GET'])
def recommendations():

    avg_aqi = db.session.query(func.avg(AQIPrediction.predicted_aqi)).scalar() or 0
    avg_aqi = round(avg_aqi, 1)

    sources = db.session.query(
        func.avg(PollutionSource.vehicles),
        func.avg(PollutionSource.industry),
        func.avg(PollutionSource.dust),
        func.avg(PollutionSource.biomass)
    ).first()

    avg_v = round(sources[0] or 0, 1)
    avg_i = round(sources[1] or 0, 1)
    avg_d = round(sources[2] or 0, 1)
    avg_b = round(sources[3] or 0, 1)

    # Impact is proportional to actual source contribution
    traffic_impact  = round((avg_v / (avg_v + avg_i + avg_d + avg_b)) * 40, 1)
    industry_impact = round((avg_i / (avg_v + avg_i + avg_d + avg_b)) * 40, 1)
    dust_impact     = round((avg_d / (avg_v + avg_i + avg_d + avg_b)) * 40, 1)
    biomass_impact  = round((avg_b / (avg_v + avg_i + avg_d + avg_b)) * 40, 1)

    return jsonify({
        "traffic": {
            "title": "Traffic Control",
            "description": f"Vehicles contribute {avg_v}% — highest pollution source",
            "source_pct": avg_v,
            "impact": traffic_impact,
            "confidence": 85,
            "timeline": "1-2 Weeks",
            "cost": "Low",
            "beforeAfter": {"before": avg_aqi, "after": round(avg_aqi * (1 - traffic_impact/100), 1)},
            "explanation": f"Vehicles are the dominant source at {avg_v}%. Reducing traffic lowers PM2.5 and NO2 significantly.",
            "implementation": ["Deploy traffic police at major intersections", "Implement odd-even vehicle scheme", "Restrict heavy trucks during peak hours", "Promote public transport usage"],
            "risks": ["Public compliance", "Economic disruption", "Enforcement challenges"]
        },
        "industry": {
            "title": "Industrial Regulation",
            "description": f"Industry contributes {avg_i}% — second major source",
            "source_pct": avg_i,
            "impact": industry_impact,
            "confidence": 78,
            "timeline": "2-4 Weeks",
            "cost": "Medium",
            "beforeAfter": {"before": avg_aqi, "after": round(avg_aqi * (1 - industry_impact/100), 1)},
            "explanation": f"Industry contributes {avg_i}%. Stricter emission norms reduce SO2 and NOx levels.",
            "implementation": ["Audit industrial units for compliance", "Install real-time emission monitors", "Issue notices to non-compliant units", "Mandate cleaner fuel usage"],
            "risks": ["Economic impact on industry", "Legal challenges", "Job losses"]
        },
        "dust": {
            "title": "Dust Suppression",
            "description": f"Dust contributes {avg_d}% — road and construction dust",
            "source_pct": avg_d,
            "impact": dust_impact,
            "confidence": 80,
            "timeline": "Immediate",
            "cost": "Low",
            "beforeAfter": {"before": avg_aqi, "after": round(avg_aqi * (1 - dust_impact/100), 1)},
            "explanation": f"Dust contributes {avg_d}%. Regular water sprinkling and covering construction sites reduces PM10.",
            "implementation": ["Deploy water sprinkler trucks on major roads", "Cover all construction material", "Mandate anti-smog guns at large sites", "Mechanised sweeping of roads"],
            "risks": ["Water scarcity", "Operational cost", "Coverage gaps"]
        },
        "biomass": {
            "title": "Biomass Burning Ban",
            "description": f"Biomass contributes {avg_b}% — crop and waste burning",
            "source_pct": avg_b,
            "impact": biomass_impact,
            "confidence": 72,
            "timeline": "1 Week",
            "cost": "Low",
            "beforeAfter": {"before": avg_aqi, "after": round(avg_aqi * (1 - biomass_impact/100), 1)},
            "explanation": f"Biomass burning contributes {avg_b}%. Banning stubble burning reduces PM2.5 spikes.",
            "implementation": ["Issue strict no-burning orders", "Provide alternative crop disposal methods", "Deploy field officers for monitoring", "Subsidise bio-decomposer for farmers"],
            "risks": ["Farmer resistance", "Monitoring difficulty", "Seasonal pressure"]
        }
    })

    # ==============================
# 5. AI INSIGHTS (GROQ)
# ==============================

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@policy_bp.route('/ai-insights', methods=['GET'])
def ai_insights():

    # Reuse your existing DB queries
    avg_aqi = db.session.query(func.avg(AQIPrediction.predicted_aqi)).scalar() or 0
    avg_aqi = round(avg_aqi, 1)

    sources = db.session.query(
        func.avg(PollutionSource.vehicles),
        func.avg(PollutionSource.industry),
        func.avg(PollutionSource.dust),
        func.avg(PollutionSource.biomass)
    ).first()

    avg_v = round(sources[0] or 0, 1)
    avg_i = round(sources[1] or 0, 1)
    avg_d = round(sources[2] or 0, 1)
    avg_b = round(sources[3] or 0, 1)

    # Forecast from your existing data
    forecast_24 = round(avg_aqi * 1.05, 1)
    forecast_72 = round(avg_aqi * 1.10, 1)

    prompt = f"""
You are an air quality policy expert for Delhi-NCR.

Current Data:
- Average AQI across Delhi-NCR: {avg_aqi}
- Vehicular Emissions: {avg_v}%
- Industrial Activity: {avg_i}%
- Road Dust: {avg_d}%
- Biomass Burning: {avg_b}%
- 24hr Forecast AQI: {forecast_24}
- 72hr Forecast AQI: {forecast_72}

Respond ONLY in this exact JSON format, no extra text, no markdown:
{{
  "summary": "2 sentence overall situation summary",
  "policy_interventions": [
    "specific intervention 1 based on dominant source",
    "specific intervention 2",
    "specific intervention 3"
  ],
  "citizen_advisories": [
    "simple health advisory 1",
    "simple health advisory 2"
  ],
  "high_risk_window": "predicted peak pollution period in next 72hrs",
  "intervention_effectiveness": {{
    "odd_even_scheme": "estimated AQI reduction if applied",
    "stubble_ban": "estimated AQI reduction if applied",
    "construction_halt": "estimated AQI reduction if applied"
  }}
}}
"""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
        text = response.choices[0].message.content.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        return jsonify(json.loads(text))

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    