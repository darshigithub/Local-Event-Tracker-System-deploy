import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewSection from "../components/ReviewSection";

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------------------------
  // Fetch Event Details (Public)
  // ----------------------------------
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/events/${eventId}`);
        if (!res.ok) throw new Error("Event not found");

        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // ----------------------------------
  // Loading / Error UI
  // ----------------------------------
  if (loading)
    return (
      <>
        <Navbar />
        <div className="container my-5 text-center">
          <div className="alert alert-info">Loading event details...</div>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="container my-5 text-center">
          <div className="alert alert-danger">{error}</div>
        </div>
        <Footer />
      </>
    );

  if (!event)
    return (
      <>
        <Navbar />
        <div className="container my-5 text-center">
          <div className="alert alert-warning">Event not found</div>
        </div>
        <Footer />
      </>
    );

  // ----------------------------------
  // Helpers
  // ----------------------------------
  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString()
    : "N/A";

  const mapUrl =
    event.googleMapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      event.location || ""
    )}`;

  // ----------------------------------
  // MAIN UI
  // ----------------------------------
  return (
    <>
      <Navbar />

      <div className="container my-5">
        {/* Event Card */}
        <div
          className="card shadow border-0 mx-auto"
          style={{ maxWidth: "900px" }}
        >
          <div className="card-body p-4">
            <h2 className="fw-bold text-primary mb-2">{event.title}</h2>
            <p className="text-muted mb-3">{event.description}</p>
            <hr />

            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>📅 Date</strong>
                <p>{formattedDate}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>⏰ Time</strong>
                <p>
                  {event.startTime} – {event.endTime}
                </p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>📍 Location</strong>
                <p>
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    {event.location}
                  </a>
                </p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>💰 Price</strong>
                <p>{event.price > 0 ? `₹${event.price}` : "Free"}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>🎟 Total Seats</strong>
                <p>{event.totalSeats}</p>
              </div>

              <div className="col-md-6 mb-3">
                <strong>✅ Available Seats</strong>
                <p>{event.availableSeats}</p>
              </div>

              <div className="col-md-12 mb-3">
                <strong>👤 Hosted By</strong>
                <p>{event.hostName || "Unknown"}</p>
              </div>

              <div className="col-md-12 mb-3">
                <strong>📌 Status</strong>
                <p>
                  {event.bookingOpen ? (
                    <span className="badge bg-success">Booking Open</span>
                  ) : (
                    <span className="badge bg-danger">Booking Closed</span>
                  )}
                </p>
              </div>
            </div>

            {/* Book Button */}
            {event.bookingOpen && event.availableSeats > 0 ? (
              <button
                className="btn btn-primary w-100 fw-bold mt-3"
                onClick={() => navigate(`/booking/${event.id}`)}
              >
                Book Now
              </button>
            ) : (
              <div className="alert alert-secondary text-center mt-3 mb-0">
                Booking Closed
              </div>
            )}
          </div>
        </div>

        {/* Review Section (JWT Protected Internally) */}
        <div className="mx-auto mt-4" style={{ maxWidth: "900px" }}>
          <ReviewSection
            eventId={Number(eventId)}
            hostName={event.hostName}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EventDetails;
