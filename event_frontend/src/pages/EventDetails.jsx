import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchWithAuth } from "../api";

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const { ok, data } = await fetchWithAuth(
          `http://localhost:5000/api/events/${eventId}`
        );

        if (!ok) {
          setError(data.error || "Failed to fetch event");
          setLoading(false);
          return;
        }

        let updatedEvent = data.event;

        // Convert binary buffer -> base64 if needed
        if (updatedEvent.image && Array.isArray(updatedEvent.image)) {
          const base64 = btoa(
            new Uint8Array(updatedEvent.image).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          updatedEvent.image = `data:image/jpeg;base64,${base64}`;
        }

        setEvent(updatedEvent);
      } catch {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  if (loading) return <div className="alert alert-info">Loading event...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!event) return <div className="alert alert-warning">Event not found</div>;

  // Google Maps link
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.address
  )}`;

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <div className="card shadow-sm border-0 rounded-3 p-4 mx-auto" style={{ maxWidth: "700px" }}>
          <h2 className="mb-3 text-primary">{event.title}</h2>

          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="img-fluid rounded mb-3"
              style={{ maxHeight: "300px", width: "100%", objectFit: "cover" }}
            />
          )}

          <p className="mb-3">{event.description}</p>

          <ul className="list-unstyled mb-3">
            <li className="mb-2"><strong>Event Date:</strong> {event.event_date}</li>
            <li className="mb-2"><strong>Time:</strong> {event.start_time} - {event.end_time}</li>
            <li className="mb-2">
              <strong>Address:</strong>{" "}
              <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
                {event.address}
              </a>
            </li>
            <li className="mb-2"><strong>Price:</strong> <span className="text-success fw-bold">₹{event.price}</span></li>
            <li className="mb-2"><strong>Available Seats:</strong> <span className="fw-bold">{event.available_seats}</span></li>
            <li className="mb-2"><strong>Category:</strong> {event.category}</li>
          </ul>

          <button
            className="btn btn-primary btn-lg w-100"
            onClick={() => navigate(`/booking/${event.event_id}`)}
          >
            Book Ticket
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EventDetails;
