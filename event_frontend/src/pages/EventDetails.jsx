import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewSection from "../components/ReviewSection";
import api from "../api";

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ---------------- FETCH EVENT ----------------
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.response?.data?.message || "Event not found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  // ---------------- REGISTER ----------------
  const handleRegister = async () => {
    try {
      setRegistering(true);

      await api.post(`/events/${eventId}/register`);

      setSuccessMsg("Successfully registered!");

      setEvent((prev) => ({
        ...prev,
        registered: true,
        availableSeats: prev.availableSeats - 1,
      }));

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  // ---------------- STATES ----------------
  if (loading)
    return (
      <>
        <Navbar />
        <div className="container text-center my-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3 text-muted">Loading event details...</p>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="container my-5 text-center">
          <div className="alert alert-danger shadow-sm">{error}</div>
        </div>
        <Footer />
      </>
    );

  if (!event) return null;

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString()
    : "N/A";

  const mapUrl =
    event.googleMapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      event.location || ""
    )}`;

  return (
    <>
      <Navbar />

      <div className="container py-5" style={{ maxWidth: "1000px" }}>

        {/* HEADER */}
        <div className="mb-4">
          <h1 className="fw-bold">{event.title}</h1>
          <p className="text-muted fs-5">{event.description}</p>

          <span
            className={`badge px-3 py-2 fs-6 ${
              event.bookingOpen ? "bg-success" : "bg-danger"
            }`}
          >
            {event.bookingOpen ? "Booking Open" : "Booking Closed"}
          </span>
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div className="alert alert-success shadow-sm">{successMsg}</div>
        )}

        {/* MAIN CARD */}
        <div className="card border-0 shadow-lg rounded-4 p-4 mb-4">

          {/* INFO GRID */}
          <div className="row g-4 text-center">

            <div className="col-md-3">
              <div className="p-3 bg-light rounded-3">
                <small className="text-muted">Date</small>
                <div className="fw-bold">{formattedDate}</div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3 bg-light rounded-3">
                <small className="text-muted">Time</small>
                <div className="fw-bold">
                  {event.startTime} – {event.endTime}
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3 bg-light rounded-3">
                <small className="text-muted">Location</small>
                <div>
                  <a href={mapUrl} target="_blank" rel="noreferrer">
                    View Map
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3 bg-light rounded-3">
                <small className="text-muted">Host</small>
                <div className="fw-bold">{event.hostName}</div>
              </div>
            </div>

          </div>

          <hr />

          {/* STATS */}
          <div className="row text-center mb-3">
            <div className="col-md-4">
              <h4 className="text-primary">
                ₹{event.price > 0 ? event.price : "Free"}
              </h4>
              <small className="text-muted">Price</small>
            </div>

            <div className="col-md-4">
              <h4>{event.totalSeats}</h4>
              <small className="text-muted">Total Seats</small>
            </div>

            <div className="col-md-4">
              <h4 className="text-success">{event.availableSeats}</h4>
              <small className="text-muted">Available</small>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="mt-4">

            {/* HOST */}
            {event.isHost && (
              <button
                className="btn btn-outline-warning w-100 py-2 fw-bold"
                onClick={() => navigate(`/event/${eventId}/manage`)}
              >
                Manage Event
              </button>
            )}

            {/* REGISTERED USER */}
            {!event.isHost && event.registered && event.availableSeats > 0 && (
              <button
                className="btn btn-primary w-100 py-2 fw-bold"
                onClick={() => navigate(`/booking/${eventId}`)}
              >
                Book Your Seat
              </button>
            )}

            {/* NOT REGISTERED */}
            {!event.isHost && !event.registered && event.availableSeats > 0 && (
              <button
                className="btn btn-success w-100 py-2 fw-bold"
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? "Processing..." : "Register Now"}
              </button>
            )}

            {/* FULL */}
            {event.availableSeats === 0 && (
              <div className="alert alert-danger text-center mt-2">
                Event Fully Booked
              </div>
            )}

          </div>

        </div>

        {/* REVIEWS */}
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h5 className="fw-bold mb-3">⭐ Reviews</h5>
          <ReviewSection eventId={Number(eventId)} />
        </div>

      </div>

      <Footer />
    </>
  );
}

export default EventDetails;