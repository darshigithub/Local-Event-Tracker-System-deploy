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

  const API_URL = "http://localhost:5000/api";

  // ---------------- Fetch Event Details ----------------
  const fetchEvent = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchWithAuth(`${API_URL}/events/${eventId}`, { method: "GET" });
      if (!res.ok) {
        setError(res.data.message || "Failed to fetch event");
      } else {
        setEvent(res.data.event);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    const interval = setInterval(fetchEvent, 10000); // auto-refresh seats
    return () => clearInterval(interval);
  }, [eventId]);

  // ---------------- Handle Booking ----------------
  const handleBooking = async () => {
    if (!event) return;

    setError("");

    if (seats < 1) {
      setError("Please select at least one seat");
      return;
    }

    if (seats > event.available_seats) {
      setError("Not enough seats available");
      return;
    }

    try {
      const res = await fetchWithAuth(`${API_URL}/bookings`, {
        method: "POST",
        body: JSON.stringify({
          event_id: event.event_id,
          number_of_seats: seats,
        }),
      });

      if (!res.ok) {
        setError(res.data.message || "Booking failed");
      } else {
        // Booking successful → immediately redirect to payment page
        const booking = res.data.booking; // backend should return booking object
        navigate(`/payment`, {
          state: {
            eventId: event.event_id,
            eventTitle: event.title,
            numberOfSeats: seats,
            totalPrice: seats * parseFloat(event.price),
            bookingId: booking?.booking_id, // optional if backend provides
          },
        });
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  if (loading) return <p className="text-center my-5">Loading event...</p>;
  if (!event) return <p className="text-center my-5">Event not found.</p>;

  const price = parseFloat(event.price);

  return (
    <>
      <Navbar />

      <div className="container my-5 d-flex justify-content-center">
        {error && <div className="alert alert-danger w-100 text-center">{error}</div>}

        <div
          className="card shadow-sm rounded-3 p-3"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h4 className="mb-3 text-primary text-center">{event.title}</h4>

          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="img-fluid mb-3 rounded"
              style={{ maxHeight: "250px", width: "100%", objectFit: "cover" }}
            />
          )}

          <div className="mb-3">
            <p className="mb-1">
              <strong>Location:</strong>{" "}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  event.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.address}
              </a>
            </p>
            <p className="mb-1"><strong>Date:</strong> {event.event_date}</p>
            <p className="mb-1"><strong>Time:</strong> {event.start_time} - {event.end_time}</p>
            <p className="mb-1"><strong>Price per seat:</strong> ₹{price.toFixed(2)}</p>
            <p className="mb-0"><strong>Available Seats:</strong> {event.available_seats}</p>
          </div>

          {/* Seat Counter */}
          <div className="d-flex align-items-center justify-content-center my-3">
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => seats > 1 && setSeats(seats - 1)}
            >
              -
            </button>
            <span className="mx-3 fs-5 fw-bold">{seats}</span>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => seats < event.available_seats && setSeats(seats + 1)}
            >
              +
            </button>
          </div>

          {/* Total Price */}
          <div className="alert alert-light border border-primary rounded-3 d-flex justify-content-between align-items-center">
            <span className="fw-bold">Total Price:</span>
            <span className="text-primary fw-bold">₹{(seats * price).toFixed(2)}</span>
          </div>

          <button className="btn btn-success w-100" onClick={handleBooking}>
            Confirm Booking & Pay
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingPage;
