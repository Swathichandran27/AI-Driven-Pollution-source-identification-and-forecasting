# Citizen Dashboard API Documentation

Base URL: `http://localhost:5000/citizen`

## 1. AQI Dashboard
**Endpoint:** `/citizen/dashboard`
**Method:** GET
**Description:** Display current AQI for all stations with category, dominant source, and pollutants

**Response:**
```json
[
  {
    "station": "Alipur, Delhi - DPCC",
    "city": "Delhi",
    "datetime": "2026-02-18 09:00:00",
    "aqi": 254.0,
    "category": "Very Poor",
    "dominant_source": "pm25",
    "pollutants": {
      "pm25": 41.50,
      "pm10": 35.95,
      "no2": 8.33,
      "co": 9.15
    },
    "alert": true
  }
]
```

## 2. Source Analysis
**Endpoint:** `/citizen/source-analysis?station=<station_name>`
**Method:** GET
**Description:** Show pollution source breakdown with AI explanation

**Response:**
```json
{
  "station": "Alipur, Delhi - DPCC",
  "city": "Delhi",
  "datetime": "2026-02-18 09:00:00",
  "dominant_source": "vehicles",
  "sources": {
    "vehicles": 46.99,
    "industry": 15.55,
    "biomass": 9.10,
    "dust": 19.71,
    "powerplant": 3.67,
    "domestic": 4.01,
    "secondary": 0.97
  },
  "explanation": "High NO₂ and CO levels indicate significant vehicular emissions"
}
```

## 3. Forecast & Alerts
**Endpoint:** `/citizen/forecast?station=<station_name>`
**Method:** GET
**Description:** 24-hour AQI forecast with trend and alerts

**Response:**
```json
{
  "station": "Alipur, Delhi - DPCC",
  "forecast": [
    {
      "hour": 0,
      "datetime": "2026-03-07 00:00:00",
      "aqi": 275.95,
      "category": "Very Poor"
    }
  ],
  "trend": "Increasing",
  "confidence": "High",
  "alerts": [
    "Avoid outdoor activities",
    "Use N95 masks if going out",
    "Keep windows closed"
  ]
}
```

## 4. Health Advisory
**Endpoint:** `/citizen/health-advisory?station=<station_name>`
**Method:** GET
**Description:** Health precautions based on current AQI

**Response:**
```json
{
  "station": "Alipur, Delhi - DPCC",
  "aqi": 275.95,
  "category": "Very Poor",
  "advisory": {
    "general": "Avoid outdoor activities",
    "sensitive": "Stay indoors, use air purifiers"
  },
  "tips": [
    "Use N95 masks outdoors",
    "Stay hydrated",
    "Avoid morning walks"
  ]
}
```

## 5. Route Suggestion
**Endpoint:** `/citizen/route-suggestion?source=<location>&destination=<location>`
**Method:** GET
**Description:** Suggest least polluted route

**Response:**
```json
{
  "source": "Location A",
  "destination": "Location B",
  "route_aqi": [
    ["Station 1", 120.5],
    ["Station 2", 145.3]
  ],
  "recommendation": "Prefer routes through Station 1",
  "alerts": []
}
```

## Testing
```bash
# Start server
python run.py

# Test endpoints
curl http://localhost:5000/citizen/dashboard
curl http://localhost:5000/citizen/source-analysis?station=Alipur,%20Delhi%20-%20DPCC
curl http://localhost:5000/citizen/forecast
curl http://localhost:5000/citizen/health-advisory
curl http://localhost:5000/citizen/route-suggestion?source=A&destination=B
```
