import pandas as pd
from app import create_app, db
from app.models import AQIPrediction, PollutionSource

# CSV paths
PREDICTION_CSV = '../ml_project/data/output/tomorrow_station_aqi.csv'
SOURCE_CSV = '../ml_project/hourly_pollution_summary.csv'


def import_predictions():

    # ======================
    # Station AQI Prediction
    # ======================

    df = pd.read_csv(PREDICTION_CSV)
    df = df.drop_duplicates(subset=['station', 'city', 'datetime', 'hour'])

    # Clear table before import to avoid duplicates
    db.session.query(AQIPrediction).delete()
    db.session.commit()

    for _, row in df.iterrows():

        prediction = AQIPrediction(
            station=row['station'],
            city=row['city'],
            datetime=row['datetime'],
            hour=int(row['hour']),
            predicted_aqi=float(row['predicted_aqi'])
        )

        db.session.add(prediction)

    db.session.commit()

    print("Prediction CSV → SQLite DONE")


    # ======================
    # Pollution Source CSV
    # ======================

    try:

        src_df = pd.read_csv(SOURCE_CSV)

        # Clear table before import to avoid duplicates
        db.session.query(PollutionSource).delete()
        db.session.commit()

        for _, row in src_df.iterrows():

            source = PollutionSource(
                datetime=row['datetime'],
                city=row['city'],
                station=row['station'],
                dominant_pollutant=row['dominant_pollutant'],
                dominant_percent=float(row['dominant_percent']),
                pm25_percent=float(row['pm25_percent']),
                pm10_percent=float(row['pm10_percent']),
                no2_percent=float(row['no2_percent']),
                so2_percent=float(row['so2_percent']),
                co_percent=float(row['co_percent']),
                ozone_percent=float(row['ozone_percent']),
                nh3_percent=float(row['nh3_percent']),
                vehicles=float(row['vehicles']),
                industry=float(row['industry']),
                biomass=float(row['biomass']),
                dust=float(row['dust']),
                powerplant=float(row['powerplant']),
                domestic=float(row['domestic']),
                secondary=float(row['secondary'])
            )
            db.session.add(source)

        db.session.commit()

        print("Source CSV → SQLite DONE")

    except FileNotFoundError:

        print("Source CSV not found")


# ======================
# MAIN
# ======================

if __name__ == "__main__":

    app = create_app()

    with app.app_context():

        db.create_all()   # Create tables

        import_predictions()