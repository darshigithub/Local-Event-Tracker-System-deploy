from database.connection import db
from datetime import date

class Review(db.Model):
    __tablename__ = "reviews"

    review_id = db.Column(db.Integer, primary_key=True)

    booking_id = db.Column(
        db.Integer,
        db.ForeignKey("bookings.booking_id"),
        unique=True,
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id"),
        nullable=False
    )

    event_id = db.Column(
        db.Integer,
        db.ForeignKey("events.event_id"),
        nullable=False
    )

    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.Text)

    review_date = db.Column(db.Date, default=date.today)

    def to_dict(self):
        return {
            "rating": self.rating,
            "review": self.review_text
        }
