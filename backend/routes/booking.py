from flask import Blueprint, request, jsonify 
from controllers.booking_controller import (
    create_booking_logic, 
    get_user_bookings_logic, 
    cancel_booking_logic
)

booking_bp = Blueprint("booking_bp", __name__)

@booking_bp.route("/bookings", methods=["POST"])
def book_event():
    data = request.get_json()
    # Note: we use 'number_of_seats' here to match your SQL/Model
    res, status = create_booking_logic(
        data.get("user_id"), 
        data.get("event_id"), 
        data.get("number_of_seats")
    )
    return jsonify(res), status

@booking_bp.route("/bookings/user/<int:user_id>", methods=["GET"])
def user_bookings(user_id):
    res, status = get_user_bookings_logic(user_id)
    return jsonify(res), status

@booking_bp.route("/bookings/<int:booking_id>/cancel", methods=["DELETE"])
def cancel_booking(booking_id):
    res, status = cancel_booking_logic(booking_id)
    return jsonify(res), status