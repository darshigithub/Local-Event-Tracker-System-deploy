from models.review import Review
from models.booking import Booking
from models.event import Event
from models.user import User

def add_review_logic(data):
    user_id = data.get("user_id")
    event_id = data.get("event_id")
    rating = data.get("rating")
    text = data.get("review_text")

    # 0. Check if event exists and is completed
    event = Event.get_by_id(event_id)
    if not event:
        return {"error": "Event not found."}, 404
    
    event_status = Event.check_and_update_status(event_id)
    if event_status != "completed":
        return {"error": "You can only review completed events."}, 400

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

    # 3. Validate rating
    if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
        return {"error": "Rating must be between 1 and 5."}, 400

    # 4. Create the review using the found booking_id
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


def get_reviews_by_event_logic(event_id):
    """Get all reviews for a specific event with user details"""
    try:
        reviews = Review.query.filter_by(event_id=event_id).all()
        
        reviews_with_user = []
        for review in reviews:
            review_dict = review.to_dict()
            # Get user details
            user = User.query.filter_by(user_id=review.user_id).first()
            if user:
                review_dict["user_name"] = user.name
                review_dict["user_profile_pic"] = user.profile_pic
            reviews_with_user.append(review_dict)
        
        # Calculate average rating
        avg_rating = 0
        if reviews:
            avg_rating = sum(r.rating for r in reviews) / len(reviews)
        
        return {
            "reviews": reviews_with_user,
            "total_reviews": len(reviews),
            "average_rating": round(avg_rating, 1)
        }, 200
    except Exception as e:
        return {"error": str(e)}, 500


def check_user_can_review_logic(event_id, user_id):
    """Check if a user can review an event"""
    try:
        # Check if event exists
        event = Event.get_by_id(event_id)
        if not event:
            return {"can_review": False, "reason": "Event not found."}, 200
        
        # Check if event is completed
        event_status = Event.check_and_update_status(event_id)
        if event_status != "completed":
            return {"can_review": False, "reason": "Event is not completed yet."}, 200
        
        # Check if user has a booking
        user_booking = Booking.query.filter_by(
            user_id=user_id,
            event_id=event_id
        ).first()
        
        if not user_booking:
            return {"can_review": False, "reason": "You must book the event to review."}, 200
        
        # Check if user already reviewed
        existing = Review.query.filter_by(booking_id=user_booking.booking_id).first()
        if existing:
            return {"can_review": False, "reason": "You have already reviewed this event.", "existing_review": existing.to_dict()}, 200
        
        return {"can_review": True, "reason": "You can review this event."}, 200
    except Exception as e:
        return {"can_review": False, "reason": str(e)}, 500