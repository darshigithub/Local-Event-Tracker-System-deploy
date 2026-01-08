from database.connection import db
from datetime import date

class Event(db.Model):
    __tablename__ = "events"

    event_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id"),
        nullable=False
    )

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)

    event_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    capacity = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)

    price = db.Column(db.Numeric(10, 2), nullable=False)

    location = db.Column(db.Text)
    category = db.Column(db.String(50))

    status = db.Column(db.String(20), default="ACTIVE")

    created_at = db.Column(db.Date, default=date.today)

    @classmethod
    def create(cls, data):
        event = cls(
            user_id=data["user_id"],
            title=data["title"],
            description=data.get("description"),
            event_date=data["event_date"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            capacity=data["capacity"],
            available_seats=data["capacity"],
            price=data["price"],
            location=data.get("location"),
            category=data.get("category"),
            status="ACTIVE"
        )
        db.session.add(event)
        db.session.commit()
        return event

    @classmethod
    def get_by_id(cls, event_id):
        return cls.query.filter_by(event_id=event_id).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()
        return self

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "event_id": self.event_id,
            "title": self.title,
            "price": str(self.price),
            "available_seats": self.available_seats,
            "status": self.status
        }
