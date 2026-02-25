import sys
sys.path.append(r"D:\Mini Project")

from app import create_app, db

app = create_app()

with app.app_context():
    db.create_all()
    # Automatically import predictions on backend start
    try:
        from backend.app.import_predictions import import_predictions
        import_predictions()
    except Exception as e:
        print(f"[Warning] Could not import predictions: {e}")

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)