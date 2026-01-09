from flask import Flask
from database.connection import db
from flask_cors import CORS



from routes.booking import booking_bp
from routes.review import review_bp


from routes.event import event_bp

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:Root1234@localhost:5432/event"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(booking_bp, url_prefix="/api")
app.register_blueprint(review_bp, url_prefix="/api")


@app.route("/")
def home():
    return "Welcome to the Event Booking API"

with app.app_context():
    db.create_all()
    

if __name__ == "__main__":
    app.run(debug=True)

