from flask import Blueprint, jsonify, request
from .models import AQIPrediction, AQIHourlyAvg, PollutionSource
from datetime import datetime

citizen_bp = Blueprint('citizen', __name__)

# Helper function to get AQI category
def get_aqi_category(aqi):
    if aqi <= 50: return "Good"
    elif aqi <= 100: return "Moderate"
    elif aqi <= 200: return "Poor"
    elif aqi <= 300: return "Very Poor"
    else: return "Severe"

# Helper function to get health advisory
def get_health_advisory(aqi):
    if aqi <= 50:
        return {"general": "Air quality is satisfactory", "sensitive": "No precautions needed"}
    elif aqi <= 100:
        return {"general": "Acceptable air quality", "sensitive": "Unusually sensitive people should limit outdoor exertion"}
    elif aqi <= 200:
        return {"general": "Reduce prolonged outdoor exertion", "sensitive": "Avoid prolonged outdoor activities"}
    elif aqi <= 300:
        return {"general": "Avoid outdoor activities", "sensitive": "Stay indoors, use air purifiers"}
    else:
        return {"general": "Health alert - avoid all outdoor activities", "sensitive": "Remain indoors, use masks if going out"}

# 0. Get All Stations List
@citizen_bp.route('/stations')
def get_stations():
    stations = AQIPrediction.query.with_entities(AQIPrediction.station, AQIPrediction.city).distinct().all()
    return jsonify([{"station": s.station, "city": s.city} for s in stations])

# 1. AQI Dashboard API
@citizen_bp.route('/dashboard')
def dashboard():
    sources = PollutionSource.query.all()
    
    result = []
    for s in sources:
        result.append({
            "station": s.station,
            "city": s.city,
            "datetime": s.datetime,
            "aqi": s.dominant_percent,
            "category": get_aqi_category(s.dominant_percent),
            "dominant_source": s.dominant_pollutant,
            "pollutants": {
                "pm25": s.pm25_percent,
                "pm10": s.pm10_percent,
                "no2": s.no2_percent,
                "co": s.co_percent
            },
            "alert": s.dominant_percent > 200
        })
    
    return jsonify(result)


# 2. Source Analysis API
@citizen_bp.route('/source-analysis')
def source_analysis():
    station = request.args.get('station')
    
    query = PollutionSource.query
    if station:
        query = query.filter_by(station=station)
    
    data = query.first()
    
    if not data:
        return jsonify({"error": "No data found"}), 404
    
    sources = {
        "vehicles": data.vehicles,
        "industry": data.industry,
        "biomass": data.biomass,
        "dust": data.dust,
        "powerplant": data.powerplant,
        "domestic": data.domestic,
        "secondary": data.secondary
    }
    
    dominant = max(sources, key=sources.get)
    
    explanation = ""
    if data.no2_percent > 30 and data.co_percent > 20:
        explanation = "High NO₂ and CO levels indicate significant vehicular emissions"
    elif data.pm10_percent > 40:
        explanation = "High PM10 suggests dust and construction activities"
    elif data.pm25_percent > 40:
        explanation = "High PM2.5 indicates biomass burning or industrial emissions"
    
    return jsonify({
        "station": data.station,
        "city": data.city,
        "datetime": data.datetime,
        "dominant_source": dominant,
        "sources": sources,
        "explanation": explanation
    })


# 3. Forecast & Alerts API
@citizen_bp.route('/forecast')
def forecast():
    station = request.args.get('station')
    
    query = AQIPrediction.query
    if station:
        query = query.filter_by(station=station)
    
    predictions = query.order_by(AQIPrediction.hour).limit(24).all()
    
    if not predictions:
        return jsonify({"error": "No forecast data"}), 404
    
    forecast_data = []
    aqi_values = []
    
    for p in predictions:
        aqi_values.append(p.predicted_aqi)
        forecast_data.append({
            "hour": p.hour,
            "datetime": p.datetime,
            "aqi": p.predicted_aqi,
            "category": get_aqi_category(p.predicted_aqi)
        })
    
    if len(aqi_values) > 1:
        if aqi_values[-1] > aqi_values[0] + 20:
            trend = "Increasing"
        elif aqi_values[-1] < aqi_values[0] - 20:
            trend = "Decreasing"
        else:
            trend = "Stable"
    else:
        trend = "Stable"
    
    alerts = []
    max_aqi = max(aqi_values)
    if max_aqi > 200:
        alerts.append("Avoid outdoor activities")
        alerts.append("Use N95 masks if going out")
        alerts.append("Keep windows closed")
    
    return jsonify({
        "station": predictions[0].station if station else "All Stations",
        "forecast": forecast_data,
        "trend": trend,
        "confidence": "High",
        "alerts": alerts
    })


# 4. Health Advisory API
@citizen_bp.route('/health-advisory')
def health_advisory():
    station = request.args.get('station')
    
    if station:
        pred = AQIPrediction.query.filter_by(station=station).first()
        if not pred:
            return jsonify({"error": "Station not found"}), 404
        aqi = pred.predicted_aqi
        return jsonify({
            "station": station,
            "aqi": aqi,
            "category": get_aqi_category(aqi),
            "advisory": get_health_advisory(aqi),
            "tips": [
                "Use N95 masks outdoors" if aqi > 150 else "Regular masks sufficient",
                "Stay hydrated",
                "Avoid morning walks" if aqi > 200 else "Morning walks safe with precautions"
            ]
        })
    else:
        avg = AQIHourlyAvg.query.first()
        aqi = avg.average_aqi if avg else 100
        return jsonify({
            "aqi": aqi,
            "category": get_aqi_category(aqi),
            "advisory": get_health_advisory(aqi),
            "tips": [
                "Use N95 masks outdoors" if aqi > 150 else "Regular masks sufficient",
                "Stay hydrated",
                "Avoid morning walks" if aqi > 200 else "Morning walks safe with precautions"
            ]
        })

# 5. Route Suggestion API
@citizen_bp.route('/route-suggestion')
def route_suggestion():
    source = request.args.get('source')
    destination = request.args.get('destination')
    
    stations = AQIPrediction.query.all()
    
    station_aqi = {}
    for s in stations:
        if s.station not in station_aqi:
            station_aqi[s.station] = s.predicted_aqi
    
    sorted_stations = sorted(station_aqi.items(), key=lambda x: x[1])
    
    return jsonify({
        "source": source,
        "destination": destination,
        "route_aqi": sorted_stations[:5],
        "recommendation": "Prefer routes through " + sorted_stations[0][0] if sorted_stations else "No data",
        "alerts": ["High pollution zone detected"] if any(aqi > 200 for _, aqi in sorted_stations[:5]) else []
    })