from flask import Flask
from database.connection import db
from routes.event import event_bp
from routes.payment import payment_bp

# 🔥 IMPORT MODELS (ABSOLUTELY REQUIRED)
from models import User, Event, Booking, Payment, Review

app = Flask(__name__)

app.register_blueprint(event_bp, url_prefix="/api")
app.register_blueprint(payment_bp, url_prefix="/api")

app.config['SQLALCHEMY_DATABASE_URI'] = (
    "postgresql+psycopg2://postgres:Meghanars%40274@localhost:5432/event"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config["SQLALCHEMY_DATABASE_URI"] = ("postgresql://postgres:Meghanars%40274@localhost:5432/event")
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/")
def home():
    return {"message": "Event API is running"}, 200





with app.app_context():
    db.create_all()
    print("✅ Tables created")

if __name__ == "__main__":
    app.run(debug=True)
