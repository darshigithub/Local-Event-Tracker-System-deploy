from flask import Blueprint, request, jsonify
from datetime import datetime
from controllers.event import (
    create_event_controller,
    get_event_controller,
    list_events_controller,
    update_event_controller,
    delete_event_controller
)

# Blueprint without default url_prefix
event_bp = Blueprint("events", __name__)

# ---------------- CREATE ----------------
@event_bp.route("/events/create", methods=["POST"])
def create_event():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    required_fields = [
        "user_id", "title", "event_date",
        "start_time", "end_time",
        "capacity", "price"
    ]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400
    if data["capacity"] <= 0:
        return jsonify({"error": "Capacity must be greater than 0"}), 400
    if data["price"] < 0:
        return jsonify({"error": "Price cannot be negative"}), 400

    try:
        data["event_date"] = datetime.strptime(data["event_date"], "%Y-%m-%d").date()
        data["start_time"] = datetime.strptime(data["start_time"], "%H:%M").time()
        data["end_time"] = datetime.strptime(data["end_time"], "%H:%M").time()
    except ValueError:
        return jsonify({"error": "Invalid date or time format"}), 400

    event, error = create_event_controller(data)
    if error:
        return jsonify({"error": error}), 400

    return jsonify({"message": "Event created successfully", "event": event.to_dict()}), 201

# ---------------- READ (ALL) ----------------
@event_bp.route("/events/list", methods=["GET"])
def list_events():
    events = list_events_controller()
    return jsonify([event.to_dict() for event in events]), 200

# ---------------- READ (ONE) ----------------
@event_bp.route("/events/view/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event, error = get_event_controller(event_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(event.to_dict()), 200

# ---------------- UPDATE ----------------
@event_bp.route("/events/update/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid or missing JSON body"}), 400
    if "capacity" in data and data["capacity"] <= 0:
        return jsonify({"error": "Capacity must be greater than 0"}), 400
    if "price" in data and data["price"] < 0:
        return jsonify({"error": "Price cannot be negative"}), 400
    try:
        if "event_date" in data:
            data["event_date"] = datetime.strptime(data["event_date"], "%Y-%m-%d").date()
        if "start_time" in data:
            data["start_time"] = datetime.strptime(data["start_time"], "%H:%M").time()
        if "end_time" in data:
            data["end_time"] = datetime.strptime(data["end_time"], "%H:%M").time()
    except ValueError:
        return jsonify({"error": "Invalid date or time format"}), 400

    event, error = update_event_controller(event_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Event updated successfully", "event": event.to_dict()}), 200

# ---------------- DELETE ----------------
@event_bp.route("/events/remove/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    error = delete_event_controller(event_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Event deleted successfully"}), 200
