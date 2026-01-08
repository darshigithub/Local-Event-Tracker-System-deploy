from database.connection import db
from datetime import date

class Payment(db.Model):
    __tablename__ = "payments"

    payment_id = db.Column(db.Integer, primary_key=True)

    booking_id = db.Column(
        db.Integer,
        db.ForeignKey("bookings.booking_id"),
        unique=True,
        nullable=False
    )

    amount = db.Column(db.Numeric(10, 2), nullable=False)

    payment_method = db.Column(db.String(50), nullable=False)

    payment_status = db.Column(
        db.String(20),
        default="SUCCESS"
    )

    payment_date = db.Column(db.Date, default=date.today)

    def to_dict(self):
        return {
            "payment_id": self.payment_id,
            "amount": str(self.amount),
            "payment_status": self.payment_status
        }
