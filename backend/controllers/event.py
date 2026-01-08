from models.event import Event

def create_event_controller(data):
    if data["start_time"] >= data["end_time"]:
        return None, "Start time must be before end time"

    return Event.create(data), None


def get_event_controller(event_id):
    event = Event.get_by_id(event_id)
    if not event:
        return None, "Event not found"
    return event, None


def list_events_controller():
    return Event.get_all()


def update_event_controller(event_id, data):
    event = Event.get_by_id(event_id)
    if not event:
        return None, "Event not found"

    if "start_time" in data and "end_time" in data:
        if data["start_time"] >= data["end_time"]:
            return None, "Start time must be before end time"

    return event.update(data), None


def delete_event_controller(event_id):
    event = Event.get_by_id(event_id)
    if not event:
        return "Event not found"

    event.delete()
    return None
