// src/pages/BookingPage.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../api";

function BookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:8080/api";

  // ---------------- Fetch Event ----------------
  const fetchEvent = async () => {
    try {
      const res = await fetchWithAuth(`${API_URL}/events/${eventId}`, {
        method: "GET",
      });

      if (!res.ok) {
        setError("Failed to load event");
      } else {
        setEvent(res.data);
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  // ---------------- Book Event ----------------
  const handleBooking = async () => {
    setError("");

    if (seats < 1) {
      setError("Please select at least one seat");
      return;
    }

    if (seats > event.availableSeats) {
      setError("Not enough seats available");
      return;
    }

    try {
      const res = await fetchWithAuth(`${API_URL}/bookings`, {
        method: "POST",
        body: JSON.stringify({
          eventId: event.id,
          seats: seats,
        }),
      });

      if (!res.ok) {
        setError(res.data?.message || "Booking failed");
      } else {
        navigate("/payment", {
          state: {
            bookingId: res.data.bookingId,
            eventTitle: event.title,
            eventDate: event.eventDate,
            startTime: event.startTime,
            endTime: event.endTime,
            seats,
            pricePerSeat: event.price,
            totalPrice: seats * event.price,
            location: event.location,
            hostName: event.hostName,
          },
        });
      }
    } catch {
      setError("Server error while booking");
    }
  };

  if (loading)
    return (
      <p className="text-center my-5 fs-5 text-secondary">Loading event details...</p>
    );
  if (!event)
    return (
      <p className="text-center my-5 fs-5 text-danger">Event not found</p>
    );

  return (
    <>
      <Navbar />

      <div className="container my-5 d-flex justify-content-center">
        <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="text-center text-primary fw-bold mb-4">{event.title}</h3>

          <div className="mb-3 d-flex justify-content-between">
            <span className="fw-bold">Date:</span>
            <span>{event.eventDate}</span>
          </div>

          <div className="mb-3 d-flex justify-content-between">
            <span className="fw-bold">Time:</span>
            <span>{event.startTime} – {event.endTime}</span>
          </div>

          <div className="mb-3 d-flex justify-content-between">
            <span className="fw-bold">Location:</span>
            <span>{event.location}</span>
          </div>

          <div className="mb-3 d-flex justify-content-between">
            <span className="fw-bold">Price per Seat:</span>
            <span className="text-success fw-bold">₹{event.price}</span>
          </div>

          <div className="mb-3 d-flex justify-content-between">
            <span className="fw-bold">Available Seats:</span>
            <span className="badge bg-info text-dark px-3 py-1">{event.availableSeats}</span>
          </div>

          {/* Seat Selector */}
          <div className="d-flex justify-content-center align-items-center my-4">
            <button
              className="btn btn-outline-danger btn-lg rounded-circle"
              onClick={() => seats > 1 && setSeats(seats - 1)}
            >
              −
            </button>
            <span className="mx-4 fs-4 fw-bold">{seats}</span>
            <button
              className="btn btn-outline-success btn-lg rounded-circle"
              onClick={() =>
                seats < event.availableSeats && setSeats(seats + 1)
              }
            >
              +
            </button>
          </div>

          {/* Total Price */}
          <div className="alert alert-light border rounded-3 d-flex justify-content-between fs-5">
            <span className="fw-bold">Total:</span>
            <span className="fw-bold text-success">₹{seats * event.price}</span>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            className="btn btn-primary w-100 fw-bold py-2 fs-5 mt-3 shadow-sm"
            onClick={handleBooking}
          >
            Confirm Booking & Pay
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingPage;
