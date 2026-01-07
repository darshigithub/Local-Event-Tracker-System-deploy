CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
 
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
 
    number_of_seats INT NOT NULL CHECK (number_of_seats > 0),
 
    booking_status VARCHAR(20)
        CHECK (booking_status IN ('PENDING', 'CONFIRMED', 'CANCELLED'))
        DEFAULT 'PENDING',
 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 
    UNIQUE (user_id, event_id)
);