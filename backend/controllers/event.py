from flask import request, jsonify
from werkzeug.utils import secure_filename
from models.event import Event
from models.user import User
from flask_jwt_extended import get_jwt_identity, jwt_required
from datetime import datetime
from database.connection import db

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------------------------------------
# CREATE EVENT — Stores Image in PostgreSQL (bytea)
# ---------------------------------------------------------
@jwt_required()
def create_event_controller():
    user_id = get_jwt_identity()

    # Read file
    image_file = request.files.get("image")
    image_data = image_file.read() if image_file else None

    # Normal form fields
    title = request.form.get("title")
    description = request.form.get("description")
    category = request.form.get("category")
    event_date = request.form.get("event_date")
    start_time = request.form.get("start_time")
    end_time = request.form.get("end_time")
    capacity = request.form.get("capacity")
    price = request.form.get("price")
    address = request.form.get("address")
    google_map_link = request.form.get("gogle_map_link")
    status = request.form.get("status", "active")

    new_event = Event(
        user_id=user_id,
        image=image_data,
        title=title,
        description=description,
        event_date=event_date,
        start_time=start_time,
        end_time=end_time,
        capacity=capacity,
        available_seats=capacity,
        price=price,
        google_map_link=google_map_link,
        address=address,
        category=category,
        status=status,
        created_at=datetime.utcnow(),
    )

    db.session.add(new_event)
    db.session.commit() 

    return jsonify({"message": "Event created", "event_id": new_event.event_id}), 201

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
    


