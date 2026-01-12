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

  useEffect(() => {
    const fetchEvents = async () => {
      const { ok, status, data } = await fetchWithAuth(
        "http://localhost:5000/api/events" 
      );

      if (!ok) {
        setError(data.message || "Unable to load events");

        if (status === 401) {
          logoutUser();
        }

        setLoading(false);
        return;
      }

      setEvents(data.events || []);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const EventCard = ({ event }) => (
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

          <ul className="list-unstyled">
            <li><strong>Location:</strong> {event.address}</li>
            <li><strong>Date:</strong> {event.event_date}</li>
            <li><strong>Time:</strong> {event.start_time} - {event.end_time}</li>
            <li><strong>Price:</strong> ₹{event.price}</li>
          </ul>

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

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="mb-4">All Public Events</h2>

        {loading && <div className="alert alert-info">Loading events...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))
          ) : (
            !loading && <p>No events found.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
