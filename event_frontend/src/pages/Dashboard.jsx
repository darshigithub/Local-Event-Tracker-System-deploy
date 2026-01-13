import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchWithAuth, logoutUser } from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (err) {
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
          className="card shadow-sm rounded-3 p-3"
          style={{ maxWidth: "350px", width: "100%" }}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt={event.title}
              className="card-img-top rounded mb-3"
              style={{ height: "200px", objectFit: "cover", width: "100%" }}
            />
          )}

          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-primary">{event.title}</h5>

            <ul className="list-unstyled small mb-3">
              <li>
                <strong>Date:</strong> {event.event_date}
              </li>
              <li>
                <strong>Location:</strong> {event.address}
              </li>
              <li>
                <strong>Price:</strong> ₹{event.price}
              </li>
            </ul>

            <button
              className="btn btn-info mt-auto w-100"
              onClick={() => navigate(`/event/${event.event_id}`)}
            >
              More Details
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
        <h2 className="mb-4 text-center">All Public Events</h2>

        {loading && <div className="alert alert-info">Loading events...</div>}

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row justify-content-center">
          {!loading && events.length === 0 && <p>No events available.</p>}

          {events.length > 0 &&
            events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
        </div>
      </div>

      <Footer />
      
    </>
  );
}

export default Dashboard;
