import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchWithAuth, logoutUser } from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // -------------------------------
  // Fetch Events
  // -------------------------------
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { ok, status, data } = await fetchWithAuth(
          "http://localhost:8080/api/events"
        );

        if (!ok) {
          setError(data.message || "Unable to load events");
          if (status === 401) logoutUser();
          return;
        }

        setEvents(data);
        setFilteredEvents(data);
      } catch {
        setError("Server error: Unable to fetch events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // -------------------------------
  // Event Card
  // -------------------------------
  const EventCard = ({ event }) => {
    return (
      <div className="col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
        <div
          className="card shadow-sm border-0"
          style={{ width: "350px", cursor: "pointer" }}
          onClick={() => navigate(`/event/${event.id}`)}
        >
          <div className="card-body">
            <h5 className="fw-bold">{event.title}</h5>

            <small className="text-muted d-block">
              📅 {event.eventDate}
            </small>

            <small className="text-muted d-block mb-2">
              📍 {event.location}
            </small>

            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold text-success">₹{event.price}</span>
              <button
                className="btn btn-sm btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/event/${event.id}`);
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------
  // JSX
  // -------------------------------
  return (
    <>
      <Navbar />

      <div className="container my-5">
        {/* Header + Create Event Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold text-primary mb-1">Things to Do</h2>
            <p className="text-muted mb-0">
              Discover amazing events near you
            </p>
          </div>

          <button
            className="btn btn-success"
            onClick={() => navigate("/host")}
          >
            ➕ Create Event
          </button>
        </div>

        {/* Search */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Search by title or location"
              value={searchQuery}
              onChange={(e) => {
                const q = e.target.value;
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
              }}
            />
          </div>
        </div>

        {loading && <div className="alert alert-info">Loading events...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row justify-content-center">
          {!loading && filteredEvents.length === 0 && (
            <p className="text-center text-muted">No events found</p>
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
