from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
from models.event import Event
from models.user import User
from flask_jwt_extended import get_jwt_identity, jwt_required

UPLOAD_FOLDER = "static/uploads/events"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def create_event_controller():
    try:
        # Get logged-in user_id from JWT token
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "Invalid token or user not logged in"}), 401

        # Check user exists
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            return jsonify({"error": "User does not exist"}), 404

        # Get form data
        data = request.form.to_dict()
        print("RAW FORM DATA:", data)

        # Handle file upload
        image_url = None
        if "image" in request.files:
            file = request.files["image"]
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                image_url = f"/{UPLOAD_FOLDER}/{filename}"

        # Convert necessary types
        title = data.get("title")
        description = data.get("description")
        category = data.get("category")
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        event_date = data.get("event_date")
        capacity = int(data.get("capacity", 0))
        price = float(data.get("price", 0))
        status = data.get("status", "active")
        address = data.get("address")
        gogle_map_link = data.get("gogle_map_link")

        print(image_url)

        # Create event
        event = Event.create({
            "user_id": user_id,
            "title": title,
            "description": description,
            "category": category,
            "start_time": start_time,
            "end_time": end_time,
            "event_date": event_date,
            "capacity": capacity,
            "price": price,
            "status": status,
            "address": address,
            "gogle_map_link": gogle_map_link,
            "image": image_url
        })

        return jsonify({
            "message": "Event created successfully",
            "event": event.to_dict()
        }), 201

    except Exception as e:
        print("EVENT CREATE ERROR:", e)
        return jsonify({"error": str(e)}), 400


# ---------------------------
# Get All Events
# ---------------------------
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
        return jsonify({"error": str(e)}), 400


# ---------------------------
# Get Event By ID
# ---------------------------
def get_event_by_id_controller(event_id):
    try:
        event = Event.get_by_id(event_id)

        if not event:
            return jsonify({"error": "Event not found"}), 404

        return jsonify({"event": event.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400  


# ---------------------------
# Update Event
# ---------------------------
@jwt_required()
def update_event_controller(event_id):
    try:
        event = Event.get_by_id(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404

        data = request.get_json()
        updated = event.update(data)

        return jsonify({
            "message": "Event updated successfully",
            "event": updated.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ---------------------------
# Delete Event
# ---------------------------
@jwt_required()
def delete_event_controller(event_id):
    try:
        event = Event.get_by_id(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404

        event.delete()
        return jsonify({"message": "Event deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
