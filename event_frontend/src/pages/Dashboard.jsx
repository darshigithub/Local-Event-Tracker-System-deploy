import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // ---------------- FETCH EVENTS ----------------
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // ---------------- SEARCH ----------------
  const handleSearch = (q) => {
    setSearchQuery(q);

    if (!q.trim()) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter(
          (ev) =>
            ev.title.toLowerCase().includes(q.toLowerCase()) ||
            ev.location.toLowerCase().includes(q.toLowerCase())
        )
      );
    }
  };

  // ---------------- EVENT CARD ----------------
  const EventCard = ({ event }) => (
    <div className="col-md-6 col-lg-4 mb-4">
      <div
        className="card border-0 shadow-sm rounded-4 h-100"
        style={{
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease"
        }}
        onClick={() => navigate(`/event/${event.id}`)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <div className="card-body d-flex flex-column">

          {/* Title */}
          <h5 className="fw-bold mb-2 text-dark">{event.title}</h5>

          {/* Date */}
          <small className="text-muted mb-1">
            📅 {event.eventDate}
          </small>

          {/* Location */}
          <small className="text-muted mb-2">
            📍 {event.location}
          </small>

          {/* Status */}
          <span
            className={`badge mb-2 ${
              event.bookingOpen ? "bg-success" : "bg-danger"
            }`}
            style={{ width: "fit-content" }}
          >
            {event.bookingOpen ? "Open" : "Closed"}
          </span>

          {/* Spacer */}
          <div className="mt-auto d-flex justify-content-between align-items-center">

            {/* Price */}
            <span className="fw-bold text-primary fs-5">
              {event.price > 0 ? `₹${event.price}` : "Free"}
            </span>

            {/* Button */}
            <button
              className="btn btn-sm btn-outline-primary rounded-pill px-3"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/event/${event.id}`);
              }}
            >
              View Details
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="container py-5">

        {/* HERO HEADER */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-primary">Discover Events</h1>
          <p className="text-muted">
            Explore and book events happening around you
          </p>
        </div>

        {/* ACTION BAR */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">

          {/* SEARCH */}
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <input
              className="form-control rounded-pill px-4 py-2 shadow-sm"
              placeholder="🔍 Search by title or location..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* CREATE BUTTON */}
          <button
            className="btn btn-success px-4 py-2 rounded-pill fw-semibold shadow-sm"
            onClick={() => navigate("/host")}
          >
            ➕ Create Event
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary"></div>
            <p className="mt-2 text-muted">Loading events...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {/* EVENTS GRID */}
        <div className="row">
          {!loading && filteredEvents.length === 0 && (
            <p className="text-center text-muted">
              No events found 😔
            </p>
          )}

          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

      </div>

      <Footer />
    </>
  );
}

export default Dashboard;