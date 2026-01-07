from flask import Blueprint, request, jsonify
from your_app import db
from your_app.models import Event  # Make sure you have Event model defined
from datetime import datetime



from your_app.controllers.events_controller import (
    add_event,
    get_all_events,
    get_event_by_id,
    update_event,
    delete_event
)
# Create a Blueprint for events routes
event_bp = Blueprint('event_bp', __name__)

# -------------------- CREATE EVENT --------------------
@event_bp.route('/event_add/', methods=['POST'])
def route_add_event():
    data = request.get_json()
    # Basic validation
    required_fields = ['user_id', 'title', 'event_date', 'start_time', 'end_time', 'capacity', 'latitude', 'longitude']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    try:
        # Call controller function
        result = add_event(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# -------------------- GET ALL EVENTS --------------------
@event_bp.route('/events/', methods=['GET'])
def route_get_events():
    try:
        result = get_all_events()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# -------------------- GET SINGLE EVENT --------------------
@event_bp.route('/events/<int:event_id>/', methods=['GET'])
def route_get_event(event_id):
    try:
        result = get_event_by_id(event_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 404

# -------------------- UPDATE EVENT --------------------
@event_bp.route('/events/<int:event_id>/update/', methods=['PUT'])
def route_update_event(event_id):
    data = request.get_json()
    try:
        result = update_event(event_id, data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# -------------------- DELETE EVENT --------------------
@event_bp.route('/events/<int:event_id>/delete/', methods=['DELETE'])
def route_delete_event(event_id):
    try:
        result = delete_event(event_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# event_bp = Blueprint('event_bp', __name__)

# @event_bp.route('event_add/', method = ['POST'])
# def support_add_product():
#     return add_product()


