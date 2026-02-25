import pandas as pd
import os

# Path to your original dataset
input_file = "delhi_ncr_aqi_dataset.csv"

# Path to save filtered data
output_file = "data/processed/aqi_2024_2025.csv"

# Create processed folder if not exists
os.makedirs("data/processed", exist_ok=True)

# Load dataset
df = pd.read_csv(input_file)

# Convert date column to datetime
df['date'] = pd.to_datetime(df['date'], errors='coerce')

# Filter only 2024 & 2025
df_filtered = df[(df['date'].dt.year == 2024) | (df['date'].dt.year == 2025)]

# Save
df_filtered.to_csv(output_file, index=False)

print("✅ Data extracted successfully!")
print(f"Rows before: {len(df)}")
print(f"Rows after: {len(df_filtered)}")
print(f"Saved to: {output_file}")
