from database.connection import db
from datetime import date

class Booking(db.Model):
    __tablename__ = "bookings"

    booking_id = db.Column(db.Integer, primary_key=True)

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

    seats_booked = db.Column(db.Integer, nullable=False)

    booking_date = db.Column(db.Date, default=date.today)

    status = db.Column(db.String(20), default="PLACED")

    def to_dict(self):
        return {
            "booking_id": self.booking_id,
            "event_id": self.event_id,
            "seats_booked": self.seats_booked,
            "status": self.status
        }
