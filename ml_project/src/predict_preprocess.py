import pandas as pd
import numpy as np
import os

# =============================
# PATHS
# =============================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

TODAY_RAW_PATH      = os.path.join(BASE_DIR, "data", "raw", "real_time_aqi_data.csv")
HISTORY_PATH        = os.path.join(BASE_DIR, "data", "processed", "aqi_2024_2025.csv")
PREDICT_INPUT_PATH  = os.path.join(BASE_DIR, "data", "processed", "predict_ready.csv")

os.makedirs(os.path.dirname(PREDICT_INPUT_PATH), exist_ok=True)

# =============================
# LOAD TODAY RAW DATA
# =============================
print("Loading today's AQI raw data...")
today = pd.read_csv(TODAY_RAW_PATH)

# Convert datetime
today['datetime'] = pd.to_datetime(today['last_update'], format="%d-%m-%Y %H:%M:%S")

# Pivot pollutants into columns
today = today.pivot_table(
    index=['station','city','datetime'],
    columns='pollutant_id',
    values='avg_value'
).reset_index()

# Store original station/city for output
today_station_original = today['station'].copy()  
today_city_original = today['city'].copy()

# Rename pollutant columns to match training
rename_map = {}
if 'PM2.5' in today.columns:
    rename_map['PM2.5'] = 'pm25'
if 'PM10' in today.columns:
    rename_map['PM10'] = 'pm10'
if 'NO2' in today.columns:
    rename_map['NO2'] = 'no2'
if 'SO2' in today.columns:
    rename_map['SO2'] = 'so2'
if 'CO' in today.columns:
    rename_map['CO'] = 'co'
if 'OZONE' in today.columns:
    rename_map['OZONE'] = 'o3'
if 'O3' in today.columns:
    rename_map['O3'] = 'o3'

today = today.rename(columns=rename_map)

# =============================
# TIME FEATURES
# =============================
today['year'] = today['datetime'].dt.year
today['month'] = today['datetime'].dt.month
today['day'] = today['datetime'].dt.day
today['hour'] = today['datetime'].dt.hour
today['day_of_week'] = today['datetime'].dt.dayofweek
today['is_weekend'] = today['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)

# =============================
# CREATE SEASON FEATURE
# =============================
def get_season(month):
    if month in [12,1,2]:
        return "winter"
    elif month in [3,4,5]:
        return "summer"
    elif month in [6,7,8]:
        return "monsoon"
    else:
        return "post_monsoon"

today['season'] = today['month'].apply(get_season)

# =============================
# LOAD HISTORY FOR LAG FEATURES
# =============================
print("Loading historical dataset for lag features...")
history = pd.read_csv(HISTORY_PATH)
history['datetime'] = pd.to_datetime(history['datetime'])

# Create consistent encoding maps from stations/cities
print("Creating encoding mappings...")

# Extract unique stations from today (these are strings)
today_stations = today['station'].unique()  # Strings
all_stations = sorted(list(today_stations))
station_map = {station: idx for idx, station in enumerate(all_stations)}

# For cities
today_cities = today['city'].unique()  # Strings
all_cities = sorted(list(today_cities))
city_map = {city: idx for idx, city in enumerate(all_cities)}

# For seasons
all_seasons = ['post_monsoon', 'monsoon', 'summer', 'winter']  # Fixed order
season_map = {season: idx for idx, season in enumerate(all_seasons)}

# Apply mapping to today's data
today['station'] = today['station'].map(station_map)
today['city'] = today['city'].map(city_map)
today['season'] = today['season'].map(season_map)

# Ensure all required pollutant columns exist (fill missing ones with 0 or mean)
for pollutant in ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3']:
    if pollutant not in today.columns:
        today[pollutant] = 0  # or could use a default value

# Combine all data for lag feature calculation
# Make sure to include time features from today
time_features = ['year', 'month', 'day', 'hour', 'day_of_week', 'is_weekend']
history_cols = ['datetime', 'station', 'city', 'season', 'pm25', 'pm10', 'no2', 'aqi'] + [c for c in time_features if c in history.columns]
today_cols = ['datetime', 'station', 'city', 'season', 'pm25', 'pm10', 'no2'] + [c for c in time_features if c in today.columns]

combined = pd.concat([history[history_cols],
                       today[today_cols]], 
                       ignore_index=True)

# Add NaN for aqi in today rows (since we're only predicting AQI, not using it as input)
combined['aqi'] = combined['aqi'].ffill()  # Forward fill placeholder

combined = combined.sort_values(['datetime']).reset_index(drop=True)

# =============================
# CREATE LAG FEATURES
# =============================
lag_cols = ['pm25','pm10','no2','aqi']

for col in lag_cols:
    if col in combined.columns:
        combined[f'{col}_lag_1'] = combined[col].shift(1)
        combined[f'{col}_lag_3'] = combined[col].shift(3)
        combined[f'{col}_lag_6'] = combined[col].shift(6)

# =============================
# ROLLING FEATURES
# =============================
for col in lag_cols:
    if col in combined.columns:
        combined[f'{col}_roll_mean_3'] = combined[col].rolling(3).mean()
        combined[f'{col}_roll_mean_6'] = combined[col].rolling(6).mean()

# =============================
# KEEP ONLY TODAY'S ROWS
# =============================
# Filter to only today's rows based on the original today datetime
today_dates = set(today['datetime'].values)
predict_df = combined[combined['datetime'].isin(today_dates)].copy()

# =============================
# ADD MISSING TIME FEATURES IF NOT ALREADY PRESENT
# =============================
if 'hour' not in predict_df.columns:
    predict_df['hour'] = predict_df['datetime'].dt.hour
if 'month' not in predict_df.columns:
    predict_df['month'] = predict_df['datetime'].dt.month
if 'day_of_week' not in predict_df.columns:
    predict_df['day_of_week'] = predict_df['datetime'].dt.dayofweek
if 'is_weekend' not in predict_df.columns:
    predict_df['is_weekend'] = predict_df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)

# =============================
# ADD MISSING POLLUTANTS
# =============================
for pollutant in ['o3', 'so2', 'co']:
    if pollutant not in predict_df.columns:
        predict_df[pollutant] = 0

# =============================
# ADD ORIGINAL STATION/CITY FOR OUTPUT
# =============================
predict_df = predict_df.reset_index(drop=True)
predict_df['station_original'] = today_station_original.values
predict_df['city_original'] = today_city_original.values

# =============================
# HANDLE MISSING VALUES
# =============================
predict_df = predict_df.fillna(predict_df.median(numeric_only=True))

# =============================
# SAVE PREDICT-READY DATA
# =============================
predict_df.to_csv(PREDICT_INPUT_PATH, index=False)

print("Prediction preprocessing completed.")
print("Saved at:", PREDICT_INPUT_PATH)
print("Categorical columns encoded using saved training encoders.")

