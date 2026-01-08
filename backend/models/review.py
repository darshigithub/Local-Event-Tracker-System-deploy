from database.connection import db
from datetime import datetime

class Review(db.Model):
    __tablename__ = "reviews"

    review_id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey("bookings.booking_id"), nullable=False, unique=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.event_id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.Text)
    review_date = db.Column(db.DateTime, default=datetime.utcnow)

    @classmethod
    def create_review(cls, booking_id, event_id, user_id, rating, text):
        new_review = cls(
            booking_id=booking_id,
            event_id=event_id,
            user_id=user_id,
            rating=rating,
            review_text=text
        )
        db.session.add(new_review)
        db.session.commit()
        return new_review

    def to_dict(self):
        return {
            "review_id": self.review_id,
            "booking_id": self.booking_id,
            "event_id": self.event_id,
            "user_id": self.user_id,
            "rating": self.rating,
            "review_text": self.review_text,
            "review_date": self.review_date.isoformat()
        }