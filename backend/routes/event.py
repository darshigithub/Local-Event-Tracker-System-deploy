from flask import Blueprint
from controllers.event import (
    create_event_controller,
    get_all_events_controller,
    get_event_by_id_controller,
    update_event_controller,
    delete_event_controller
)

event_bp = Blueprint("event", __name__)

# Create Event
@event_bp.route("/events", methods=["POST"])
def create_event():
    return create_event_controller()

# Get All Events
@event_bp.route("/events", methods=["GET"])
def get_all_events():
    return get_all_events_controller()

# Get Event by ID
@event_bp.route("/events/<int:event_id>", methods=["GET"])
def get_event_by_id(event_id):
    return get_event_by_id_controller(event_id)

# Update Event
@event_bp.route("/events/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    return update_event_controller(event_id)

# Delete Event
@event_bp.route("/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    return delete_event_controller(event_id)
