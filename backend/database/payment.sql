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

 

CREATE OR REPLACE FUNCTION update_booking_status_after_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'SUCCESS' THEN
        UPDATE bookings
        SET booking_status = 'CONFIRMED'
        WHERE booking_id = NEW.booking_id;
    ELSE
        UPDATE bookings
        SET booking_status = 'CANCELLED'
        WHERE booking_id = NEW.booking_id;
    END IF;
 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trigger_update_booking_status
AFTER INSERT ON payments
FOR EACH ROW
EXECUTE FUNCTION update_booking_status_after_payment();

 