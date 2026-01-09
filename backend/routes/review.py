from flask import Blueprint, request, jsonify
from controllers.review_controller import add_review_logic

review_bp = Blueprint("review_bp", __name__)

@review_bp.route("/reviews", methods=["POST"])
def add_review():
    data = request.get_json()
    # Postman sends: user_id, event_id, rating, review_text
    res, status = add_review_logic(data)
    return jsonify(res), status
