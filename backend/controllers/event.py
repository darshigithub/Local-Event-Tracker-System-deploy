from models.event import Event
from flask import request, jsonify
from models.user import User

# def create_event_controller():
#     try:
#         data = request.get_json()

#         event = Event.create(data)

#         return jsonify({
#             "message": "Event created successfully",
#             "event": event.to_dict()
#         }), 201

#     except Exception as e:
#         return jsonify({"error": str(e)}), 400


def create_event_controller():
    try:
        data = request.get_json()

        # Check if user exists
        user = User.query.filter_by(user_id=data.get("user_id")).first()
        if not user:
            return jsonify({"error": "User does not exist"}), 404

        # Create event
        event = Event.create(data)

        return jsonify({
            "message": "Event created successfully",
            "event": event.to_dict()
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400



def get_all_events_controller():
    try:
        events = Event.get_all()
        return jsonify([event.to_dict() for event in events]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def get_event_by_id_controller(event_id):
    try:
        event = Event.get_by_id(event_id)

        if not event:
            return jsonify({"message": "Event not found"}), 404

        return jsonify(event.to_dict()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


def update_event_controller(event_id):
    try:
        event = Event.get_by_id(event_id)

        if not event:
            return jsonify({"message": "Event not found"}), 404

        data = request.get_json()
        updated_event = event.update(data)

        return jsonify({
            "message": "Event updated successfully",
            "event": updated_event.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


def delete_event_controller(event_id):
    try:
        event = Event.get_by_id(event_id)

        if not event:
            return jsonify({"message": "Event not found"}), 404

        event.delete()

        return jsonify({"message": "Event deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
