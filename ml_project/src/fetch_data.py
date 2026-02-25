import os
from dotenv import load_dotenv
from datagovindia import DataGovIndia
import pandas as pd


def main():
    # Load API key
    load_dotenv()
    API_KEY = os.getenv("DATA_GOV_API_KEY")

    if not API_KEY:
        print("API Key not found. Check your .env file.")
        return

    # Initialize client
    datagovin = DataGovIndia(API_KEY)

    RESOURCE_ID = "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69"

    print("Fetching real-time AQI data for Delhi-NCR...")

    try:
        data = datagovin.get_data(
            RESOURCE_ID,
            filters={'city': "Delhi"}
        )

        if data is not None and not data.empty:
            print(f"Successfully fetched {len(data)} records!")
            print("\nFirst 5 rows:")
            print(data.head())

            # -------- SAVE INSIDE data/raw --------
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            raw_data_dir = os.path.join(base_dir, "data", "raw")
            os.makedirs(raw_data_dir, exist_ok=True)

            file_path = os.path.join(raw_data_dir, "real_time_aqi_data.csv")
            data.to_csv(file_path, index=False)

            print(f"\nData saved successfully at:\n{file_path}")
        else:
            print("No data retrieved. Check filters or Resource ID.")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()
