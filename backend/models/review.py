from sqlalchemy import (
    Column, Integer, Text,
    ForeignKey, TIMESTAMP, CheckConstraint, UniqueConstraint
)
from sqlalchemy.sql import func
from models import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    event_id = Column(
        Integer,
        ForeignKey("events.event_id", ondelete="CASCADE")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id", ondelete="CASCADE")
    )

    rating = Column(Integer)
    review_text = Column(Text)

    created_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 5"),
        UniqueConstraint("event_id", "user_id"),
    )
