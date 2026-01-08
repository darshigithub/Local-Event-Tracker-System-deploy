from flask import Flask
from database.connection import db
from flask_cors import CORS

# 🔥 IMPORT MODELS (ABSOLUTELY REQUIRED)
from models import User, Event, Booking, Payment, Review


from routes.event import event_bp

app = Flask(__name__)

   

CORS(app)  

app.register_blueprint(user_bp, url_prefix="/api")

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:root@localhost:5432/event"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()
    print("✅ Tables created yes")

if __name__ == "__main__":
    app.run(debug=True)
