from app import db

# AQI Predictions Table
class AQIPrediction(db.Model):
    __tablename__ = "aqi_predictions"

    station = db.Column(db.String(100), primary_key=True)
    city = db.Column(db.String(100))
    datetime = db.Column(db.String(50), primary_key=True)
    hour = db.Column(db.Integer, primary_key=True)
    predicted_aqi = db.Column(db.Float)


# Hourly Average Table (Frontend Graph)
class AQIHourlyAvg(db.Model):
    __tablename__ = "aqi_hourly_avg"

    datetime = db.Column(db.String(50), primary_key=True)
    hour = db.Column(db.Integer)
    average_aqi = db.Column(db.Float)


# Pollution Source Table
# Pollution Source Table
class PollutionSource(db.Model):
    __tablename__ = "pollution_sources"

    id = db.Column(db.Integer, primary_key=True)

    datetime = db.Column(db.String(50))
    city = db.Column(db.String(100))
    station = db.Column(db.String(100))

    dominant_pollutant = db.Column(db.String(50))
    dominant_percent = db.Column(db.Float)

    # Pollutant % contribution
    pm25_percent = db.Column(db.Float)
    pm10_percent = db.Column(db.Float)
    no2_percent = db.Column(db.Float)
    so2_percent = db.Column(db.Float)
    co_percent = db.Column(db.Float)
    ozone_percent = db.Column(db.Float)
    nh3_percent = db.Column(db.Float)

    # Source % contribution
    vehicles = db.Column(db.Float)
    industry = db.Column(db.Float)
    biomass = db.Column(db.Float)
    dust = db.Column(db.Float)
    powerplant = db.Column(db.Float)
    domestic = db.Column(db.Float)
    secondary = db.Column(db.Float)