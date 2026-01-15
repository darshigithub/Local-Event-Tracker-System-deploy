import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewSection from "../components/ReviewSection";
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

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-secondary";
      case "cancelled":
        return "bg-danger";
      case "active":
      default:
        return "bg-success";
    }
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden mx-auto" style={{ maxWidth: "800px" }}>
          {event.image && (
            <div style={{ position: "relative" }}>
              <img
                src={event.image}
                alt={event.title}
                className="img-fluid"
                style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
              />
              <span
                className={`badge ${getStatusBadge(event.status)} text-capitalize position-absolute`}
                style={{ top: "15px", right: "15px", fontSize: "0.9rem", padding: "8px 15px" }}
              >
                {event.status}
              </span>
            </div>
          )}

          <div className="p-4">
            <h2 className="fw-bold mb-3" style={{ color: "#ff5722" }}>{event.title}</h2>
            
            <p className="text-muted mb-4">{event.description}</p>

            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar-event me-2" style={{ color: "#ff5722", fontSize: "1.2rem" }}></i>
                  <div>
                    <small className="text-muted d-block">Date</small>
                    <strong>{event.event_date}</strong>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-clock me-2" style={{ color: "#ff5722", fontSize: "1.2rem" }}></i>
                  <div>
                    <small className="text-muted d-block">Time</small>
                    <strong>{event.start_time} - {event.end_time}</strong>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-geo-alt me-2" style={{ color: "#ff5722", fontSize: "1.2rem" }}></i>
                  <div>
                    <small className="text-muted d-block">Location</small>
                    <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ color: "#ff5722" }}>
                      {event.address}
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-tag me-2" style={{ color: "#ff5722", fontSize: "1.2rem" }}></i>
                  <div>
                    <small className="text-muted d-block">Category</small>
                    <strong>{event.category}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center p-3 mb-3" style={{ backgroundColor: "#fff3e0", borderRadius: "8px" }}>
              <div>
                <small className="text-muted d-block">Price per ticket</small>
                <h3 className="mb-0 fw-bold" style={{ color: "#ff5722" }}>₹{event.price}</h3>
              </div>
              <div className="text-end">
                <small className="text-muted d-block">Available Seats</small>
                <h5 className="mb-0 fw-bold">{event.available_seats}</h5>
              </div>
            </div>

            {/* Only show Book Ticket button if event is active */}
            {event.status === "active" ? (
              <button
                className="btn btn-lg w-100"
                style={{ backgroundColor: "#ff5722", color: "white", border: "none", fontWeight: "600" }}
                onClick={() => navigate(`/booking/${event.event_id}`)}
              >
                Book Now
              </button>
            ) : event.status === "completed" ? (
              <div className="alert alert-info mb-0">
                <i className="bi bi-check-circle me-2"></i>
                This activity has been completed.
              </div>
            ) : (
              <div className="alert alert-danger mb-0">
                <i className="bi bi-x-circle me-2"></i>
                This activity has been cancelled.
              </div>
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className="mx-auto mt-4" style={{ maxWidth: "800px" }}>
          <ReviewSection eventId={parseInt(eventId)} eventStatus={event.status} />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EventDetails;
