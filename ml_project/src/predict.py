import pandas as pd
import os
import joblib

# =============================
# PATHS
# =============================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

PREDICT_INPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "predict_ready.csv")
MODEL_PATH         = os.path.join(BASE_DIR, "models", "forecast_model.pkl")
OUTPUT_PATH        = os.path.join(BASE_DIR, "data", "output", "tomorrow_station_aqi.csv")
SIMPLE_OUTPUT_PATH = os.path.join(BASE_DIR, "data", "processed", "tomorrow_aqi_predictions.csv")

os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
os.makedirs(os.path.dirname(SIMPLE_OUTPUT_PATH), exist_ok=True)

# =============================
# LOAD DATA
# =============================
print("Loading prediction dataset...")
df = pd.read_csv(PREDICT_INPUT_PATH)

print("Loading trained model...")
model = joblib.load(MODEL_PATH)

# =============================
# FEATURES (must match training)
# =============================
features = [
    'station',    # categorical (encoded)
    'city',       # categorical (encoded)
    'season',     # categorical (encoded)
    'pm25','pm10','no2','so2','co','o3',
    'hour','month','day_of_week','is_weekend',
    'pm25_lag_1','pm25_lag_3','pm25_lag_6',
    'pm10_lag_1','pm10_lag_3','pm10_lag_6',
    'no2_lag_1','no2_lag_3','no2_lag_6',
    'aqi_lag_1','aqi_lag_3','aqi_lag_6',
    'pm25_roll_mean_3','pm25_roll_mean_6',
    'pm10_roll_mean_3','pm10_roll_mean_6',
    'no2_roll_mean_3','no2_roll_mean_6',
    'aqi_roll_mean_3','aqi_roll_mean_6'
]

# Ensure all feature columns exist
missing_cols = [c for c in features if c not in df.columns]
if missing_cols:
    raise ValueError(f"Missing feature columns in predict dataset: {missing_cols}")

X = df[features]

# =============================
# PREDICT TOMORROW AQI
# =============================
predictions = model.predict(X)
df['predicted_aqi'] = predictions

# =============================
# UPDATE DATETIME TO TOMORROW
# =============================
# Shift datetime by 1 day to reflect that predictions are for tomorrow
df['predicted_datetime'] = pd.to_datetime(df['datetime']) + pd.Timedelta(days=1)

# =============================
# OUTPUT 1: DETAILED STATION-WISE CSV
# =============================
result = df[['station_original', 'city_original', 'predicted_datetime', 'predicted_aqi']].copy()
result.columns = ['station', 'city', 'datetime', 'predicted_aqi']
result.to_csv(OUTPUT_PATH, index=False)

print("Tomorrow AQI predicted station-wise (with correct datetime).")
print("Saved at:", OUTPUT_PATH)

# =============================
# OUTPUT 2: SIMPLE FORMAT (for frontend)
# =============================
simple_result = df[['station_original', 'predicted_aqi']].copy()
simple_result.columns = ['station', 'predicted_aqi']
simple_result.to_csv(SIMPLE_OUTPUT_PATH, index=False)

print("Simple format (station + AQI) saved at:", SIMPLE_OUTPUT_PATH)

# =============================
# OPTIONAL: FOR HOURLY PREDICTIONS
# =============================
# If your model predicts hourly AQI, make sure `hour` column is correct
# You can shift it by 1 day as well, keeping the same hour
# df['predicted_hourly_datetime'] = pd.to_datetime(df['datetime']) + pd.Timedelta(days=1)
