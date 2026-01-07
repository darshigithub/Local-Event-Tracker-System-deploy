from sqlalchemy import (
    Column, Integer, String, Numeric,
    ForeignKey, TIMESTAMP, CheckConstraint
)
from sqlalchemy.sql import func
from models import Base


class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, index=True)

    booking_id = Column(
        Integer,
        ForeignKey("bookings.booking_id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    payment_reference = Column(String(100))

    amount = Column(Numeric(10, 2), nullable=False)

    payment_status = Column(
        String(20),
        nullable=False
    )

    payment_gateway = Column(
        String(50),
        nullable=False
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    __table_args__ = (
        CheckConstraint(
            "payment_status IN ('SUCCESS', 'FAILED')",
            name="check_payment_status"
        ),
        CheckConstraint(
            "payment_gateway IN ('Razorpay', 'PayPal', 'Stripe', 'Paytm')",
            name="check_payment_gateway"
        ),
    )
