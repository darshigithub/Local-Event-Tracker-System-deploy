from models.review import Review
from models.booking import Booking

def add_review_logic(data):
    user_id = data.get("user_id")
    event_id = data.get("event_id")
    rating = data.get("rating")
    text = data.get("review_text")

    # 1. Find the booking_id for this user and event
    user_booking = Booking.query.filter_by(
        user_id=user_id, 
        event_id=event_id
    ).first()

    if not user_booking:
        return {"error": "No booking found. You must book the event before reviewing."}, 404

    # 2. Check if a review already exists for this booking_id
    existing = Review.query.filter_by(booking_id=user_booking.booking_id).first()
    if existing:
        return {"error": "You have already reviewed this booking."}, 400

    # 3. Create the review using the found booking_id
    try:
        review = Review.create_review(
            booking_id=user_booking.booking_id,
            event_id=event_id,
            user_id=user_id,
            rating=rating,
            text=text
        )
        return review.to_dict(), 201
    except Exception as e:
        return {"error": str(e)}, 500