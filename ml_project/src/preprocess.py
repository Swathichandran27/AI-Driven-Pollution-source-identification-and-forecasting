import pandas as pd
import os
import joblib
from sklearn.preprocessing import LabelEncoder

# =============================
# PATHS
# =============================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

PROCESSED_PATH = os.path.join(BASE_DIR, "data", "processed", "aqi_2024_2025.csv")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoders.pkl")

os.makedirs(os.path.dirname(PROCESSED_PATH), exist_ok=True)
os.makedirs(os.path.dirname(ENCODER_PATH), exist_ok=True)

# =============================
# LOAD DATA
# =============================
print("Loading dataset...")
df = pd.read_csv(PROCESSED_PATH)
print("Initial shape:", df.shape)

# =============================
# DATETIME PROCESSING
# =============================
print("Processing datetime...")

df['datetime'] = pd.to_datetime(df['datetime'])
df = df.sort_values(by=['station', 'datetime'])

# Extract time features
df['year'] = df['datetime'].dt.year
df['month'] = df['datetime'].dt.month
df['day'] = df['datetime'].dt.day
df['hour'] = df['datetime'].dt.hour
df['day_of_week'] = df['datetime'].dt.dayofweek

# Weekend flag
df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)

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

df['season'] = df['month'].apply(get_season)

# =============================
# HANDLE MISSING VALUES
# =============================
print("Handling missing values...")

pollutants = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3', 'aqi']

for col in pollutants:
    if col in df.columns:
        df[col] = df[col].fillna(df[col].median())

# =============================
# CREATE LAG FEATURES
# =============================
print("Creating lag features...")

lag_cols = ['pm25', 'pm10', 'no2', 'aqi']

for col in lag_cols:
    if col in df.columns:
        df[f'{col}_lag_1'] = df.groupby('station')[col].shift(1)
        df[f'{col}_lag_3'] = df.groupby('station')[col].shift(3)
        df[f'{col}_lag_6'] = df.groupby('station')[col].shift(6)

# =============================
# ROLLING AVERAGES
# =============================
print("Creating rolling features...")

for col in lag_cols:
    if col in df.columns:
        df[f'{col}_roll_mean_3'] = df.groupby('station')[col].rolling(3).mean().reset_index(0, drop=True)
        df[f'{col}_roll_mean_6'] = df.groupby('station')[col].rolling(6).mean().reset_index(0, drop=True)

df = df.dropna()

# =============================
# LABEL ENCODING + SAVE ENCODERS
# =============================
print("Encoding categorical features...")

cat_cols = ['city', 'station', 'season', 'aqi_category']

encoders = {}

for col in cat_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# SAVE encoder mapping for prediction stage
joblib.dump(encoders, ENCODER_PATH)
print("Encoders saved at:", ENCODER_PATH)

# =============================
# SAVE PROCESSED DATASET
# =============================
print("Shape after feature engineering:", df.shape)

df.to_csv(PROCESSED_PATH, index=False)

print(df.isnull().sum())
print(df.dtypes)

print("Processed dataset saved at:", PROCESSED_PATH)
print("Training preprocessing completed successfully.")
