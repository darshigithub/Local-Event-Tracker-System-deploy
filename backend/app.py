from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from database.connection import db
from flask_jwt_extended import JWTManager

from routes.user import user_bp
from routes.booking import booking_bp
from routes.review import review_bp
from routes.event import event_bp

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:Meghanars%40274@localhost:5432/event_reg"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT Configuration
app.config["JWT_SECRET_KEY"] = "your_secret_key_here"  # Replace with strong secret
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=30)  # Access token
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)     # Refresh token
jwt = JWTManager(app)


db.init_app(app)


app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(event_bp, url_prefix="/api")
app.register_blueprint(booking_bp, url_prefix="/api")
app.register_blueprint(review_bp, url_prefix="/api")


@app.route("/")
def home():
    return "Welcome to the Event Booking API"


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
