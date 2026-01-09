from your_app.models import Event, db
from datetime import datetime

# -------------------- CREATE EVENT --------------------
def add_event(data):
    event = Event(
        user_id=data['user_id'],
        title=data['title'],
        description=data.get('description'),
        event_date=datetime.strptime(data['event_date'], '%Y-%m-%d').date(),
        start_time=datetime.strptime(data['start_time'], '%H:%M:%S').time(),
        end_time=datetime.strptime(data['end_time'], '%H:%M:%S').time(),
        capacity=data['capacity'],
        price=data.get('price', 0),
        latitude=data['latitude'],
        longitude=data['longitude'],
        address=data.get('address'),
        category=data.get('category'),
        status=data.get('status', 'active')
    )
    db.session.add(event)
    db.session.commit()
    return {'message': 'Event created', 'event': event.to_dict()}

# -------------------- GET ALL EVENTS --------------------
def get_all_events():
    events = Event.query.all()
    return [event.to_dict() for event in events]

# -------------------- GET SINGLE EVENT --------------------
def get_event_by_id(event_id):
    event = Event.query.get_or_404(event_id)
    return event.to_dict()

# -------------------- UPDATE EVENT --------------------
def update_event(event_id, data):
    event = Event.query.get_or_404(event_id)

    event.title = data.get('title', event.title)
    event.description = data.get('description', event.description)
    if 'event_date' in data:
        event.event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
    if 'start_time' in data:
        event.start_time = datetime.strptime(data['start_time'], '%H:%M:%S').time()
    if 'end_time' in data:
        event.end_time = datetime.strptime(data['end_time'], '%H:%M:%S').time()
    event.capacity = data.get('capacity', event.capacity)
    event.price = data.get('price', event.price)
    event.latitude = data.get('latitude', event.latitude)
    event.longitude = data.get('longitude', event.longitude)
    event.address = data.get('address', event.address)
    event.category = data.get('category', event.category)
    event.status = data.get('status', event.status)

    db.session.commit()
    return {'message': 'Event updated', 'event': event.to_dict()}

# -------------------- DELETE EVENT --------------------
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return {'message': 'Event deleted'}



