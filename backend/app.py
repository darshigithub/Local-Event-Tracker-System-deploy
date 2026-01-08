from flask import Flask
from flask_cors import CORS
from database.connection import db

from routes.user import user_bp
from routes.booking import booking_bp
from routes.review import review_bp

app = Flask(__name__)

# Enable CORS
CORS(app)

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:Root1234@localhost:5432/event"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize DB
db.init_app(app)

# Register Blueprints
app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(booking_bp, url_prefix="/api")
app.register_blueprint(review_bp, url_prefix="/api")

@app.route("/")
def home():
    return "Welcome to the Event Booking API"

# Create tables
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
