from flask import Blueprint
from controllers.booking_controller import (
    create_booking_controller,
    get_user_bookings_controller,
    cancel_booking_controller
)

booking_bp = Blueprint("booking_bp", __name__, url_prefix="/api")

booking_bp.route("/bookings", methods=["POST"])(create_booking_controller)
booking_bp.route("/bookings/me", methods=["GET"])(get_user_bookings_controller)
booking_bp.route("/bookings/<int:booking_id>", methods=["DELETE"])(cancel_booking_controller)
