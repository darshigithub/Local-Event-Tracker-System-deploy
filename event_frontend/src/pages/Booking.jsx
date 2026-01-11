import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Booking() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const userId = localStorage.getItem("user_id");

  // Fetch single event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/events/${eventId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch event");
        setEvent(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleBooking = async () => {
    if (!userId) {
      setError("You must be logged in to book tickets.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(userId),
          event_id: parseInt(eventId),
          number_of_seats: seats
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Booking failed");
      } else {
        setSuccess("Booking successful!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  if (!event) return <p className="text-center my-5">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container my-5">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card p-4 shadow">
          <h3 className="mb-3">Book Your Ticket for {event.title}</h3>
          <p><strong>Location:</strong> {event.address}</p>
          <p><strong>Date & Time:</strong> {event.event_date} | {event.start_time} - {event.end_time}</p>
          <p><strong>Price per seat:</strong> ₹{event.price}</p>
          <p><strong>Available Seats:</strong> {event.available_seats || 50}</p>

          <div className="d-flex align-items-center mb-3">
            <button
              className="btn btn-danger"
              onClick={() => seats > 1 && setSeats(seats - 1)}
            >
              -
            </button>
            <span className="mx-3">{seats}</span>
            <button
              className="btn btn-success"
              onClick={() =>
                seats < (event.available_seats || 50) && setSeats(seats + 1)
              }
            >
              +
            </button>
          </div>

          <h5>Total Price: ₹{seats * event.price}</h5>
          <button className="btn btn-primary w-100" onClick={handleBooking}>
            Book Ticket
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Booking;
