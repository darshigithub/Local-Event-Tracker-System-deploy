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