from sqlalchemy import (
    Column, Integer, String, ForeignKey,
    TIMESTAMP, CheckConstraint, UniqueConstraint
)
from sqlalchemy.sql import func
from models import Base

class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    event_id = Column(Integer, ForeignKey("events.event_id", ondelete="CASCADE"))

    number_of_seats = Column(Integer, nullable=False)

    booking_status = Column(String(20), default="PENDING")

    created_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        CheckConstraint("number_of_seats > 0"),
        UniqueConstraint("user_id", "event_id"),
    )
