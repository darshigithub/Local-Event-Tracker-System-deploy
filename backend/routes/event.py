from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.event import (
    create_event_controller,
    get_all_events_controller,
    get_event_by_id_controller,
    update_event_controller,
    delete_event_controller
)

event_bp = Blueprint("event", __name__)

@event_bp.route("/events", methods=["POST"])
def create_event():
    return create_event_controller()

@event_bp.route("/events", methods=["GET"])
@jwt_required()
def get_all_events():
    return get_all_events_controller()

@event_bp.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    return get_event_by_id_controller(event_id)

@event_bp.route("/events/<int:event_id>", methods=["PUT"])
@jwt_required()
def update_event(event_id):
    return update_event_controller(event_id)

@event_bp.route("/events/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id):
    return delete_event_controller(event_id)
