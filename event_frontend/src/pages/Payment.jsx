// src/pages/Payment.jsx
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract booking info from state
  const booking = location.state;

  useEffect(() => {
    // If someone navigates directly to /payment without state, redirect to dashboard
    if (!booking) {
      navigate("/dashboard");
    }
  }, [booking, navigate]);

  if (!booking) return null; // Prevent render until redirect

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center mb-4">Payment Summary</h2>

        <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "500px" }}>
          <p><strong>Event:</strong> {booking.eventTitle}</p>
          <p><strong>Number of Seats:</strong> {booking.numberOfSeats}</p>
          <p><strong>Total Price:</strong> ₹{booking.totalPrice.toFixed(2)}</p>

          <hr />

          <h5 className="mb-3">Payment Method</h5>
          <p> {/* Placeholder for actual payment integration */} 
            Payment gateway integration goes here.
          </p>

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={() => alert("Payment simulation complete!")}
          >
            Pay Now
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Payment;
