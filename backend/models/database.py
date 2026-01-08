from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

<<<<<<< HEAD
DATABASE_URL = "postgresql://postgres:Root1234@localhost:5432/event"
=======
DATABASE_URL = "postgresql://postgres:root@localhost:5432/event"
>>>>>>> main

engine = create_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
