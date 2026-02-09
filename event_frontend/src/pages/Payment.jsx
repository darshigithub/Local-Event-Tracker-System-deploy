// src/pages/Payment.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state;
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigate("/dashboard");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      alert("Payment successful!");
      navigate("/dashboard", { replace: true });
    }, 2000);
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center mb-4 text-primary fw-bold">Payment Summary</h2>

        {/* Booking Summary Card */}
        <div className="card shadow-lg border-0 mx-auto p-4" style={{ maxWidth: "600px" }}>
          <h5 className="mb-4 text-secondary">Booking Details</h5>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <span className="fw-bold">Event:</span>
            <span className="badge bg-primary text-white px-3 py-2">{booking.eventTitle}</span>
          </div>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <span className="fw-bold">Number of Seats:</span>
            <span className="badge bg-info text-dark px-3 py-2">{booking.numberOfSeats}</span>
          </div>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <span className="fw-bold">Total Amount:</span>
            <span className="badge bg-success text-white px-3 py-2">₹{booking.totalPrice.toFixed(2)}</span>
          </div>

          <hr />

          {/* Payment Method */}
          <h5 className="mb-3 text-secondary">Payment Method</h5>
          <div className="mb-3">
            <select className="form-select form-select-lg">
              <option value="">Select Payment Method</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          <button
            className={`btn btn-primary w-100 fw-bold mt-3 py-2 ${isPaying ? "disabled" : ""}`}
            onClick={handlePayment}
          >
            {isPaying ? "Processing Payment..." : "Pay Now"}
          </button>
        </div>

        {/* Optional: Payment Note */}
        <div className="text-center text-muted mt-3" style={{ maxWidth: "600px", margin: "auto" }}>
          <small>By clicking "Pay Now", you agree to our <u>Terms & Conditions</u> and <u>Privacy Policy</u>.</small>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Payment;
