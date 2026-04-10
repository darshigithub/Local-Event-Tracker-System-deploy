import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;
  const [isPaying, setIsPaying] = useState(false);
  const [method, setMethod] = useState("");

  useEffect(() => {
    if (!booking) {
      navigate("/dashboard");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const handlePayment = () => {
    if (!method) {
      alert("Please select a payment method");
      return;
    }

    setIsPaying(true);

    setTimeout(() => {
      alert("✅ Payment successful!");
      navigate("/dashboard", { replace: true });
    }, 2000);
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center fw-bold mb-5 text-dark">
          💳 Secure Payment
        </h2>

        <div className="row g-4 justify-content-center">

          {/* ================= LEFT: BOOKING SUMMARY ================= */}
          <div className="col-md-5">
            <div className="card border-0 shadow-lg rounded-4 p-4 h-100">

              <h5 className="fw-bold mb-4 text-primary">
                📄 Booking Summary
              </h5>

              {/* Event Title */}
              <div className="mb-3">
                <small className="text-muted">Event</small>
                <div className="fw-semibold fs-5">
                  {booking.eventTitle}
                </div>
              </div>

              {/* Seats */}
              <div className="mb-3">
                <small className="text-muted">Seats Booked</small>
                <div className="fw-semibold">
                  {booking.seats}
                </div>
              </div>

              <hr />

              {/* Price Breakdown */}
              <div className="mb-2 d-flex justify-content-between">
                <span>Seat Price</span>
                <span>₹{(booking.totalPrice / booking.seats).toFixed(2)}</span>
              </div>

              <div className="mb-2 d-flex justify-content-between">
                <span>Total Seats</span>
                <span>{booking.seats}</span>
              </div>

              <hr />

              {/* TOTAL */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <h5>Total Amount</h5>
                <h4 className="text-success fw-bold">
                  ₹{booking.totalPrice.toFixed(2)}
                </h4>
              </div>

            </div>
          </div>

          {/* ================= RIGHT: PAYMENT METHODS ================= */}
          <div className="col-md-5">
            <div className="card border-0 shadow-lg rounded-4 p-4">

              <h5 className="fw-bold mb-4 text-primary">
                💰 Select Payment Method
              </h5>

              {/* Payment Options */}
              <div className="d-grid gap-3">

                <button
                  className={`btn ${method === "card" ? "btn-primary" : "btn-outline-secondary"} text-start py-3`}
                  onClick={() => setMethod("card")}
                >
                  💳 Credit / Debit Card
                </button>

                <button
                  className={`btn ${method === "upi" ? "btn-primary" : "btn-outline-secondary"} text-start py-3`}
                  onClick={() => setMethod("upi")}
                >
                  📱 UPI (Google Pay / PhonePe)
                </button>

                <button
                  className={`btn ${method === "netbanking" ? "btn-primary" : "btn-outline-secondary"} text-start py-3`}
                  onClick={() => setMethod("netbanking")}
                >
                  🏦 Net Banking
                </button>

                <button
                  className={`btn ${method === "wallet" ? "btn-primary" : "btn-outline-secondary"} text-start py-3`}
                  onClick={() => setMethod("wallet")}
                >
                  👛 Wallet
                </button>

              </div>

              {/* Pay Button */}
              <button
                className="btn btn-success w-100 fw-bold mt-4 py-3 rounded-3"
                onClick={handlePayment}
                disabled={isPaying}
              >
                {isPaying
                  ? "Processing Payment..."
                  : `Pay ₹${booking.totalPrice.toFixed(2)}`}
              </button>

              {/* Secure Note */}
              <p className="text-muted text-center mt-3 mb-0">
                <small>🔒 100% Secure Payments</small>
              </p>

            </div>
          </div>

        </div>

        {/* TERMS */}
        <div className="text-center text-muted mt-4">
          <small>
            By continuing, you agree to our{" "}
            <u>Terms & Conditions</u> and{" "}
            <u>Privacy Policy</u>.
          </small>
        </div>

      </div>

      <Footer />
    </>
  );
}

export default Payment;