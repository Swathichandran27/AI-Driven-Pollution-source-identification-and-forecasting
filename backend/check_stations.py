import sqlite3

DB_PATH = r"D:\Mini Project\backend\instance\database.db"
conn = sqlite3.connect(DB_PATH)

cursor = conn.cursor()
cursor.execute("SELECT DISTINCT station FROM aqi_predictions LIMIT 10")
stations = cursor.fetchall()

print("Available stations:")
for s in stations:
    print(f"  - {s[0]}")

conn.close()
