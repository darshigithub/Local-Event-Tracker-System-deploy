from flask import Flask
from database.connection import db

# 🔥 IMPORT MODELS (ABSOLUTELY REQUIRED)
from models import User, Event, Booking, Payment, Review

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:root@localhost:5432/event"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    print("✅ Tables created")

if __name__ == "__main__":
    app.run(debug=True)