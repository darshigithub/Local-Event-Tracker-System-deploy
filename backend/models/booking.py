from database.connection import db
from datetime import datetime

class Booking(db.Model):
    __tablename__ = "bookings"

    booking_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.event_id"), nullable=False)
    number_of_seats = db.Column(db.Integer, nullable=False)
    booking_status = db.Column(db.String(20), default="PENDING")
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 

    __table_args__ = (
        db.UniqueConstraint("user_id", "event_id", name="unique_user_event"),
    )

    @classmethod
    def get_by_user_and_event(cls, user_id, event_id):
        return cls.query.filter_by(user_id=user_id, event_id=event_id).first()

    @classmethod
    def get_by_user(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    @classmethod
    def get_by_id(cls, booking_id):
        return cls.query.get(booking_id)

    @classmethod
    def create(cls, user_id, event_id, seats):
        booking = cls(
            user_id=user_id,
            event_id=event_id,
            number_of_seats=seats
        )
        db.session.add(booking)
        db.session.commit()
        return booking

    def cancel(self):
        self.booking_status = "CANCELLED"
        db.session.commit() 

    def to_dict(self):
        return {
            "booking_id": self.booking_id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "number_of_seats": self.number_of_seats,
            "booking_status": self.booking_status,
            "created_at": self.created_at.isoformat()
        }
