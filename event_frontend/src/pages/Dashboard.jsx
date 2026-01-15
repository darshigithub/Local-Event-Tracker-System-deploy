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
          "http://localhost:5000/api/events"
        );

        if (!ok) {
          setError(data.error || data.message || "Unable to load events");

          if (status === 401) logoutUser();

          setLoading(false);
          return;
        }

        // Convert binary buffer -> base64
        const updatedEvents = (data.events || []).map((event) => {
          if (event.image && Array.isArray(event.image)) {
            const base64 = btoa(
              new Uint8Array(event.image).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            return { ...event, image: `data:image/jpeg;base64,${base64}` };
          }
          return event;
        });

        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents);
      } catch {
        setError("Server error: Unable to fetch events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // -------------------------------
  // Event Card Component
  // -------------------------------
  const EventCard = ({ event }) => {
    const imageSrc =
      event.image ||
      "https://source.unsplash.com/400x300/?event,music,party";

    return (
      <div className="col-md-6 col-lg-4 mb-4 d-flex justify-content-center">
        <div
          className="card shadow-sm rounded-3 border-0 overflow-hidden"
          style={{
            maxWidth: "350px",
            width: "100%",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "";
          }}
          onClick={() => navigate(`/event/${event.event_id}`)}
        >
          {imageSrc && (
            <div style={{ position: "relative" }}>
              <img
                src={imageSrc}
                alt={event.title}
                className="card-img-top"
                style={{ height: "220px", objectFit: "cover", width: "100%" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#ff5722",
                  color: "white",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "600"
                }}
              >
                ₹{event.price}
              </div>
            </div>
          )}

          <div className="card-body p-3">
            <h5 className="card-title fw-bold mb-2" style={{ color: "#333", fontSize: "1.1rem" }}>
              {event.title}
            </h5>

            <div className="mb-2">
              <small className="text-muted">
                <i className="bi bi-calendar-event me-1"></i>
                {event.event_date}
              </small>
            </div>

            <div className="mb-3">
              <small className="text-muted">
                <i className="bi bi-geo-alt me-1"></i>
                {event.address}
              </small>
            </div>

            <button
              className="btn w-100"
              style={{
                backgroundColor: "#ff5722",
                color: "white",
                border: "none",
                fontWeight: "600"
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/event/${event.event_id}`);
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------
  // Main JSX
  // -------------------------------
  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="mb-4 text-center fw-bold" style={{ color: "#ff5722" }}>
          Things to Do
        </h2>
        <p className="text-center text-muted mb-4">
          Discover amazing activities, attractions, and experiences
        </p>

        {/* Search Bar */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8 col-lg-6">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search" style={{ color: "#ff5722" }}></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search activities, attractions, or locations..."
                value={searchQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  
                  if (query.trim() === "") {
                    setFilteredEvents(events);
                  } else {
                    const filtered = events.filter((event) =>
                      event.title.toLowerCase().includes(query.toLowerCase()) ||
                      event.address.toLowerCase().includes(query.toLowerCase())
                    );
                    setFilteredEvents(filtered);
                  }
                }}
                style={{ fontSize: "1rem" }}
              />
            </div>
          </div>
        </div>

        {loading && <div className="alert alert-info">Loading events...</div>}

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row justify-content-center">
          {!loading && filteredEvents.length === 0 && (
            <p className="text-center text-muted">
              {searchQuery ? "No activities found matching your search." : "No events available."}
            </p>
          )}

          {filteredEvents.length > 0 &&
            filteredEvents.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
        </div>
      </div>

      <Footer />
      
    </>
  );
}

export default Dashboard;
