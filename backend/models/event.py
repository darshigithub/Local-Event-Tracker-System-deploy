from database.connection import db
from datetime import datetime, timezone, timedelta
import base64
from cache.redis_client import redis_client

# IST timezone offset (UTC+5:30)
IST = timezone(timedelta(hours=5, minutes=30))


class Event(db.Model):
    __tablename__ = "events"

    event_id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    # ✅ Allow NULL to avoid crashes
    image = db.Column(db.LargeBinary, nullable=False) 

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)

    event_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)

    # 🔥 Used for Redis TTL
    event_end_at = db.Column(db.DateTime, nullable=False)

    capacity = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)

    price = db.Column(db.Numeric(10, 2), nullable=False, default=0)

    google_map_link = db.Column(db.Text)
    address = db.Column(db.Text)
    category = db.Column(db.String(50))

    # DB status is only backup
    status = db.Column(
        db.String(20),
        db.CheckConstraint("status IN ('active', 'cancelled', 'completed')"),
        default="active"
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # ------------------------------------------------
    # SERIALIZATION
    # ------------------------------------------------
    def to_dict(self):
        image_base64 = None
        if self.image:
            image_base64 = base64.b64encode(self.image).decode("utf-8")

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

            # 🔥 Redis-based status with time check and DB sync
            "status": Event.check_and_update_status(self.event_id),

            "image": f"data:image/jpeg;base64,{image_base64}" if image_base64 else None,
            "created_at": self.created_at.isoformat()
        }

    # ------------------------------------------------
    # CREATE EVENT
    # ------------------------------------------------
    @classmethod
    def create(cls, data, image_file=None):

        # 🔥 compute end time once (in IST local time)
        event_end_at = datetime.combine(
            data["event_date"],
            data["end_time"]
        )

        event = cls(
            user_id=data["user_id"],
            title=data["title"],
            description=data.get("description"),
            event_date=data["event_date"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            event_end_at=event_end_at,
            capacity=int(data["capacity"]),
            available_seats=int(data["capacity"]),
            price=data.get("price", 0),
            google_map_link=data.get("google_map_link"),
            address=data.get("address"),
            category=data.get("category"),
            image=image_file.read() if image_file else None,
        )

        db.session.add(event)
        db.session.commit()  # event_id created here

        # 🔥 Redis TTL - use local time for comparison since event_end_at is in local time
        now_ist = datetime.now()  # Local time (IST)
        ttl_seconds = int((event_end_at - now_ist).total_seconds())

        if ttl_seconds > 0:
            redis_client.setex(
                f"event_status:{event.event_id}",
                ttl_seconds,
                "active"
            )

        return event

    # ------------------------------------------------
    # REDIS STATUS
    # ------------------------------------------------
    @classmethod
    def get_status(cls, event_id):
        """
        Get event status from Redis. If Redis key expired (TTL reached),
        the event is completed. Also updates DB status if needed.
        """
        status = redis_client.get(f"event_status:{event_id}")
        
        if status:
            return status
        
        # Redis key expired - event is completed
        # Also update DB status to 'completed' for consistency
        event = cls.query.filter_by(event_id=event_id).first()
        if event and event.status != "completed":
            event.status = "completed"
            db.session.commit()
        
        return "completed"
    
    @classmethod
    def check_and_update_status(cls, event_id):
        """
        Check if event should be completed based on current time
        and update both Redis and DB accordingly.
        """
        event = cls.query.filter_by(event_id=event_id).first()
        if not event:
            return None
        
        now = datetime.now()  # Local time
        
        # If event end time has passed, mark as completed
        if event.event_end_at and now > event.event_end_at:
            # Delete Redis key if exists
            redis_client.delete(f"event_status:{event_id}")
            
            # Update DB status
            if event.status != "completed":
                event.status = "completed"
                db.session.commit()
            
            return "completed"
        
        # Event is still active
        return cls.get_status(event_id)

    # ------------------------------------------------
    # DB HELPERS
    # ------------------------------------------------
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

        if image_file:
            self.image = image_file.read()

        db.session.commit()
        return self

    def delete(self):
        db.session.delete(self)
        db.session.commit()
