from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from models import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
