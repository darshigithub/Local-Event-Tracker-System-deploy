import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");  

  // Get user ID from localStorage
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      setError("You must be logged in to view events.");
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/events?user_id=${userId}` 
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || data.error || "Failed to fetch events");
        } else {
          setEvents(data);
        }
      } catch (err) {
        setError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  // Single Event Card inside this file
  const EventCard = ({ event }) => { 
    return ( 
      <div className="col-md-4 mb-4">
        <div className="card h-100 shadow-sm">
          <img
            src={event.image || "https://source.unsplash.com/400x300/?event"}
            className="card-img-top"
            alt={event.title}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{event.title}</h5>
            <p className="card-text">{event.description}</p>

            <ul className="list-unstyled mb-2">
              <li>
                <strong>Location:</strong> {event.address}
              </li>
              <li>
                <strong>Date:</strong> {event.event_date}
              </li>
              <li>
                <strong>Time:</strong> {event.start_time} - {event.end_time}
              </li>
              {event.gogle_map_link && (
                <li>
                  <a
                    href={event.gogle_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    View on Google Maps
                  </a>
                </li>
              )}
              <li>
                <strong>Price:</strong> ₹{event.price}
              </li>
            </ul>

            {/* Reviews (example) */}
            <div className="mb-3">
              <strong>Reviews:</strong>
              <div className="small">⭐⭐⭐⭐☆ (4/5)</div>
            </div>

            <button
              className="btn btn-primary mt-auto"
              onClick={() => navigate(`/booking/${event.event_id}`)}
            >
              Book Ticket
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>All Public Events</h2>
          <button className="btn btn-primary" onClick={() => navigate("/host")}>
            Create Event
          </button>
        </div>

        {loading && <div className="alert alert-info">Loading events...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {events.length > 0
            ? events.map((event) => (
                <EventCard key={event.event_id} event={event} />
              ))
            : !loading && (
                <div className="col-12">
                  <p>No events found.</p>
                </div>
              )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
