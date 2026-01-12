from database.connection import db
from datetime import datetime
import base64

class Event(db.Model):
    __tablename__ = "events"

    event_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)

    # PostgreSQL BYTEA (works with binary uploads)
    image = db.Column(db.LargeBinary, nullable=False)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)

    event_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    capacity = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)

    price = db.Column(db.Numeric(10, 2), nullable=False, default=0)

    google_map_link = db.Column(db.Text)
    address = db.Column(db.Text)

    category = db.Column(db.String(50))
    status = db.Column(
        db.String(20),
        db.CheckConstraint("status IN ('active', 'cancelled', 'completed')"),
        default="active"
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "event_id": self.event_id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "event_date": self.event_date.isoformat(),
            "start_time": self.start_time.strftime("%H:%M:%S"),
            "end_time": self.end_time.strftime("%H:%M:%S"),
            "capacity": self.capacity,
            "available_seats": self.available_seats,
            "price": str(self.price),
            "google_map_link": self.google_map_link,
            "address": self.address,
            "category": self.category,
            "status": self.status,
            # Convert bytea → base64 string
            "image": base64.b64encode(self.image).decode("utf-8"),
            "created_at": self.created_at.isoformat()
        }

    @classmethod
    def create(cls, data, image_file=None):
        event = cls(
            user_id=data["user_id"],
            title=data["title"],
            description=data.get("description"),
            event_date=data["event_date"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            capacity=int(data["capacity"]),
            available_seats=int(data["capacity"]),
            price=data["price"],
            google_map_link=data.get("google_map_link"),
            address=data.get("address"),
            category=data.get("category"),
            image=image_file.read() if image_file else None,
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

    def update(self, data, image_file=None):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

        # If new image uploaded
        if image_file:
            self.image = image_file.read()

        db.session.commit()
        return self

    def delete(self):
        db.session.delete(self)
        db.session.commit()
