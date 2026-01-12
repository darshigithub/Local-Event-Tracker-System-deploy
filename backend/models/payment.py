from database.connection import db

from datetime import date

from datetime import datetime

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
 
    
 
    payment_reference = db.Column(db.String(100), unique=True)  # Unique gateway reference
 
    # ---------------- Timestamps ----------------

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
 
    # ---------------- Optional Fields ----------------

    currency = db.Column(db.String(10), default="INR", nullable=False)  # Currency code

    gateway_response = db.Column(db.JSON, nullable=True)  # Store raw response from payment gateway
 
    # ---------------- Relationships ----------------

    booking = db.relationship("Booking", backref=db.backref("payment", uselist=False))
 
    # ---------------- Constraints ----------------

    __table_args__ = (

        db.CheckConstraint(

            "payment_status IN ('SUCCESS', 'FAILED', 'PENDING')",

            name="check_payment_status"

        ),

        db.CheckConstraint(

            "payment_method IN ('Razorpay', 'PayPal', 'Stripe', 'Paytm')",

            name="check_payment_method"

        ),

        db.CheckConstraint(

            "amount >= 0",

            name="check_amount_positive"

        ),

    )
 
 
    payment_date = db.Column(db.Date, default=date.today)
 
    def to_dict(self):

        return {

            "payment_id": self.payment_id,

            "amount": str(self.amount),

            "payment_status": self.payment_status

        }

 