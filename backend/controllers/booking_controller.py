from models.booking import Booking

def create_booking_logic(user_id, event_id, count):
    # Business Rule: Unique check
    if Booking.get_by_user_and_event(user_id, event_id):
        return {"error": "Booking already exists for this user/event"}, 400

    booking = Booking.create(user_id, event_id, count)
    return booking.to_dict(), 201

def get_user_bookings_logic(user_id):
    bookings = Booking.get_by_user(user_id)
    return [b.to_dict() for b in bookings], 200

def cancel_booking_logic(booking_id):
    booking = Booking.get_by_id(booking_id)
    if not booking:
        return {"error": "Booking not found"}, 404
    
    booking.cancel()
    return booking.to_dict(), 200
