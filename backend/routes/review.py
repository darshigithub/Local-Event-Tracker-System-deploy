from flask import Blueprint, request, jsonify
from controllers.review_controller import add_review_logic, get_reviews_by_event_logic, check_user_can_review_logic

review_bp = Blueprint("review_bp", __name__)

@review_bp.route("/reviews", methods=["POST"])
def add_review():
    data = request.get_json()
    # Postman sends: user_id, event_id, rating, review_text
    res, status = add_review_logic(data)
    return jsonify(res), status

@review_bp.route("/reviews/event/<int:event_id>", methods=["GET"])
def get_reviews_by_event(event_id):
    """Get all reviews for a specific event"""
    res, status = get_reviews_by_event_logic(event_id)
    return jsonify(res), status

@review_bp.route("/reviews/can-review/<int:event_id>/<int:user_id>", methods=["GET"])
def check_user_can_review(event_id, user_id):
    """Check if a user can review an event (has booking and event is completed)"""
    res, status = check_user_can_review_logic(event_id, user_id)
    return jsonify(res), status
