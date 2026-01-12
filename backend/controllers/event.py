from flask import request, jsonify
from werkzeug.utils import secure_filename
from models.event import Event
from models.user import User
from flask_jwt_extended import get_jwt_identity, jwt_required
from datetime import datetime

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------------------------------------
# CREATE EVENT — Stores Image in PostgreSQL (bytea)
# ---------------------------------------------------------
@jwt_required()
def create_event_controller():
    try:
        user_id = get_jwt_identity()

        # Validate user
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            return jsonify({"error": "User does not exist"}), 404

        # Read form fields
        data = request.form.to_dict()

        # Convert required fields
        if "event_date" in data:
            data["event_date"] = datetime.strptime(data["event_date"], "%Y-%m-%d").date()

        if "start_time" in data:
            data["start_time"] = datetime.strptime(data["start_time"], "%H:%M").time()

        if "end_time" in data:
            data["end_time"] = datetime.strptime(data["end_time"], "%H:%M").time()

        data["capacity"] = int(data.get("capacity", 0))
        data["price"] = float(data.get("price", 0.0))
        data["user_id"] = user_id

        # ----- Handle Image -----
        image_file = request.files.get("image")
        if not image_file:
            return jsonify({"error": "Image file is required"}), 400

        if not allowed_file(image_file.filename):
            return jsonify({"error": "Invalid image format"}), 400

        # Convert image to bytes
        image_bytes = image_file.read()

        # Create event
        event = Event.create(data, image_file=image_file)

        return jsonify({
            "message": "Event created successfully",
            "event": event.to_dict()
        }), 201

    except Exception as e:
        print("EVENT CREATE ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------
# GET ALL EVENTS
# ---------------------------------------------------------
def get_all_events_controller():
    try:
        user_id = request.args.get("user_id")

        if user_id:
            events = Event.query.filter_by(user_id=user_id).all()
        else:
            events = Event.get_all()

        return jsonify({
            "events": [event.to_dict() for event in events]
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------
# GET EVENT BY ID
# ---------------------------------------------------------
def get_event_by_id_controller(event_id):
    try:
        event = Event.get_by_id(event_id)

        if not event:
            return jsonify({"error": "Event not found"}), 404

        return jsonify({"event": event.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------
# UPDATE EVENT WITH IMAGE SUPPORT
# ---------------------------------------------------------
@jwt_required()
def update_event_controller(event_id):
    try:
        event = Event.get_by_id(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404

        data = request.form.to_dict()

        # Convert date/time if included
        if "event_date" in data:
            data["event_date"] = datetime.strptime(data["event_date"], "%Y-%m-%d").date()

        if "start_time" in data:
            data["start_time"] = datetime.strptime(data["start_time"], "%H:%M").time()

        if "end_time" in data:
            data["end_time"] = datetime.strptime(data["end_time"], "%H:%M").time()

        # Handle updated image if uploaded
        image_file = request.files.get("image")

        updated_event = event.update(data=data, image_file=image_file)

        return jsonify({
            "message": "Event updated successfully",
            "event": updated_event.to_dict()
        }), 200

    except Exception as e:
        print("UPDATE EVENT ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------
# DELETE EVENT
# ---------------------------------------------------------
@jwt_required()
def delete_event_controller(event_id):
    try:
        event = Event.get_by_id(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404

        event.delete()
        return jsonify({"message": "Event deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
