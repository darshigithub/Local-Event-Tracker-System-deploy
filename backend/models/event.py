from database.connection import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = "events"

    event_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)

    event_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    capacity = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)  # ✅ Added

    price = db.Column(db.Numeric(10, 2), nullable=False, default=0)

    gogle_map_link = db.Column(db.Text)
    address = db.Column(db.Text)

    category = db.Column(db.String(50))

    status = db.Column(
        db.String(20),
        db.CheckConstraint("status IN ('active', 'cancelled', 'completed')"),
        default="active"
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # -------------------------
    # Convert model to dictionary
    # -------------------------
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
            "gogle_map_link": self.gogle_map_link,
            "address": self.address,
            "category": self.category,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }

    # -------------------------
    # Create a new event
    # -------------------------
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
            available_seats=data["capacity"],  # initially same as capacity
            price=data["price"],
            gogle_map_link=data.get("gogle_map_link"),  # ✅ corrected
            address=data.get("address"),                # ✅ corrected
            category=data.get("category"),
            status="active"
        )
        db.session.add(event)
        db.session.commit()
        return event

    # -------------------------
    # Get event by ID
    # -------------------------
    @classmethod
    def get_by_id(cls, event_id):
        return cls.query.filter_by(event_id=event_id).first()

    # -------------------------
    # Get all events
    # -------------------------
    @classmethod
    def get_all(cls):
        return cls.query.all()

    # -------------------------
    # Update event
    # -------------------------
    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()
        return self

    # -------------------------
    # Delete event
    # -------------------------
    def delete(self):
        db.session.delete(self)
        db.session.commit()

