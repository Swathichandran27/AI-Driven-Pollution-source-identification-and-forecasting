import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# =============================
# PATHS
# =============================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "aqi_2024_2025.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "forecast_model.pkl")

os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

# =============================
# LOAD DATA
# =============================
print("Loading processed dataset...")
df = pd.read_csv(DATA_PATH)

# =============================
# CREATE TARGET (TOMORROW AQI)
# =============================
print("Creating tomorrow AQI target...")
df["target_aqi"] = df["aqi"].shift(-24)
df = df.dropna()

# =============================
# SELECT FEATURES (STATION-AWARE!)
# =============================
features = [
    'station',    # <- new
    'city',       # <- new
    'season',     # <- new

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

X = df[features]
y = df["target_aqi"]

# =============================
# TIME SPLIT (VERY IMPORTANT)
# =============================
train = df[df['year'] == 2024]
test  = df[df['year'] == 2025]

X_train = train[features]
y_train = train["target_aqi"]

X_test = test[features]
y_test = test["target_aqi"]

# =============================
# TRAIN MODEL
# =============================
print("Training Random Forest model...")

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=20,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# =============================
# EVALUATE
# =============================
preds = model.predict(X_test)

mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)

print("MAE:", mae)
print("R2 Score:", r2)

# =============================
# SAVE MODEL
# =============================
joblib.dump(model, MODEL_PATH)

print("Model saved at:", MODEL_PATH)
print("Forecast training completed.")
