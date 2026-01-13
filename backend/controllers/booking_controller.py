from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.booking import Booking
from database.connection import db

# -----------------------------
# CREATE BOOKING
# -----------------------------
@jwt_required()
def create_booking_controller():
    user_id = get_jwt_identity()
    data = request.get_json() 

    event_id = data.get("event_id")
    seats = data.get("number_of_seats", 1)

    # Check duplicate booking
    if Booking.get_by_user_and_event(user_id, event_id):
        return jsonify({"error": "Booking already exists"}), 400

    booking = Booking.create(user_id, event_id, seats)
    return jsonify(booking.to_dict()), 201


# -----------------------------
# GET USER BOOKINGS (JWT)
# -----------------------------
@jwt_required()
def get_user_bookings_controller():
    user_id = get_jwt_identity()
    bookings = Booking.get_by_user(user_id)

    return jsonify([b.to_dict() for b in bookings]), 200


# -----------------------------
# CANCEL BOOKING
# -----------------------------
@jwt_required()
def cancel_booking_controller(booking_id): 
    user_id = get_jwt_identity()
    booking = Booking.get_by_id(booking_id) 

    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    print(type(user_id), type(booking.user_id))

    if booking.user_id != int(user_id): 
        return jsonify({"error": "Unauthorized"}), 403

    booking.cancel()
    return jsonify(booking.to_dict()), 200
