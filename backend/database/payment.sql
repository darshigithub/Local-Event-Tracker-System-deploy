CREATE TABLE payments (

    payment_id SERIAL PRIMARY KEY,
 
    booking_id INT UNIQUE REFERENCES bookings(booking_id) ON DELETE CASCADE,

    payment_reference VARCHAR(100),
 
    amount NUMERIC(10,2) NOT NULL,
 
    payment_status VARCHAR(20)

        CHECK (payment_status IN ('SUCCESS', 'FAILED')),
 
    payment_gateway VARCHAR(50)

        CHECK (payment_gateway IN ('Razorpay', 'PayPal', 'Stripe', 'Paytm')),
 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 

);