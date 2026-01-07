from sqlalchemy import (
    Column, Integer, String, Text, Date, Time,
    Numeric, DECIMAL, ForeignKey, TIMESTAMP
)
from sqlalchemy.sql import func
from models import Base

class Event(Base):
    __tablename__ = "events"

    event_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))

    title = Column(String(200), nullable=False)
    description = Column(Text)

    event_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    capacity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False, default=0)

    latitude = Column(DECIMAL(9, 6), nullable=False)
    longitude = Column(DECIMAL(9, 6), nullable=False)
    address = Column(Text)

    category = Column(String(50))

    status = Column(String(20), default="active")

    created_at = Column(TIMESTAMP, server_default=func.now())
