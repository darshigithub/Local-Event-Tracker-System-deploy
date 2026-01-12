from database.connection import db
from models import Payment
 
# ---------------- CREATE ----------------
def create_payment(data): 
    required_fields = ["booking_id", "amount", "payment_method", "payment_status"]
    for field in required_fields:
        if field not in data:
            return {"error": f"{field} is required"}, 400
 
    if data["payment_status"] not in ["SUCCESS", "FAILED"]:
        return {"error": "Invalid payment_status. Must be 'SUCCESS' or 'FAILED'"}, 400
 
    if data["payment_method"] not in ["Razorpay", "PayPal", "Stripe", "Paytm"]:
        return {"error": "Invalid payment_method"}, 400
 
    existing_payment = Payment.query.filter_by(booking_id=data["booking_id"]).first()
    if existing_payment:
        return {"error": "Payment for this booking already exists"}, 400
 
    payment = Payment(
        booking_id=data["booking_id"],
        amount=data["amount"],
        payment_method=data["payment_method"],
        payment_status=data["payment_status"]
    )
 
    db.session.add(payment)
    db.session.commit()
    return payment.to_dict(), 201
 
# ---------------- READ ALL ----------------
def get_all_payments():
    payments = Payment.query.all()
    return [p.to_dict() for p in payments], 200
 
# ---------------- READ ONE ----------------
def get_payment_by_id(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return {"error": "Payment not found"}, 404
    return payment.to_dict(), 200
 
# ---------------- UPDATE ----------------
def update_payment(payment_id, data):
    payment = Payment.query.get(payment_id)
    if not payment:
        return {"error": "Payment not found"}, 404
 
    if "payment_status" in data:
        if data["payment_status"] not in ["SUCCESS", "FAILED"]:
            return {"error": "Invalid payment_status"}, 400
        payment.payment_status = data["payment_status"]
 
    if "payment_method" in data:
        if data["payment_method"] not in ["Razorpay", "PayPal", "Stripe", "Paytm"]:
            return {"error": "Invalid payment_method"}, 400
        payment.payment_method = data["payment_method"]
 
    if "amount" in data:
        payment.amount = data["amount"]
 
    db.session.commit()
    return payment.to_dict(), 200
 
# ---------------- DELETE ----------------
def delete_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return {"error": "Payment not found"}, 404
 
    db.session.delete(payment)
    db.session.commit()
    return {"message": "Payment deleted successfully"}, 200
 
 
