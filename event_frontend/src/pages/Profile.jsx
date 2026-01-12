import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchWithAuth, logoutUser } from "../api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [bookedEvents, setBookedEvents] = useState([]);
  const [hostedEvents, setHostedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");


  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // ---------------- USER PROFILE ----------------
        const userRes = await fetchWithAuth(
          `http://localhost:5000/api/users/${userId}` 
        );
        if (!userRes.ok) {
          if (userRes.status === 401) logoutUser();
          return;
        }
        setUser(userRes.data.user || userRes.data);

        // ---------------- BOOKED EVENTS ----------------
        const bookedRes = await fetchWithAuth(
          `http://localhost:5000/api/bookings?user_id=${userId}`
        );
        if (!bookedRes.ok) {
          if (bookedRes.status === 401) logoutUser();
        } else {
          setBookedEvents(bookedRes.data.bookings || bookedRes.data);
        }

        // ---------------- HOSTED EVENTS ----------------
        const hostedRes = await fetchWithAuth(
          `http://localhost:5000/api/events?user_id=${userId}`
        );
        if (!hostedRes.ok) {
          if (hostedRes.status === 401) logoutUser();
        } else {
          // For consistency with your events controller:
          setHostedEvents(hostedRes.data.events || hostedRes.data);
        }

      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  return (
    <>
      <Navbar />

      <div className="container my-5">
        {loading ? (
          <div className="alert alert-info">Loading your profile...</div>
        ) : (
          <>
            {/* ---------------- USER INFO ---------------- */}
            <div className="card shadow-sm mb-4">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="fw-bold">{user.name}</h3>
                  <p className="text-muted mb-0">{user.email}</p>
                  <p className="text-muted mb-0">User ID: {user.user_id}</p>
                </div>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/edit-profile")}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* ---------------- BOOKED EVENTS ---------------- */}
            <div className="mb-5">
              <h4 className="fw-bold mb-3">Booked Events</h4>

              {bookedEvents.length === 0 ? (
                <p className="text-muted">You have not booked any events yet.</p>
              ) : (
                <div className="row">
                  {bookedEvents.map((event) => (
                    <div className="col-md-4 mb-3" key={event.booking_id}>
                      <div className="card h-100 shadow-sm">
                        <img
                          src={event.image || "https://source.unsplash.com/400x300/?event"}
                          className="card-img-top"
                          alt={event.title}
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{event.title}</h5>
                          <p className="text-muted mb-2">{event.event_date}</p>
                          <button
                            className="btn btn-primary mt-auto"
                            onClick={() => navigate(`/booking/${event.event_id}`)}
                          >
                            View Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ---------------- HOSTED EVENTS ---------------- */}
            <div className="mb-5">
              <h4 className="fw-bold mb-3">Hosted Events</h4>

              {hostedEvents.length === 0 ? (
                <p className="text-muted">You have not hosted any events yet.</p>
              ) : (
                <div className="row">
                  {hostedEvents.map((event) => (
                    <div className="col-md-4 mb-3" key={event.event_id}>
                      <div className="card h-100 shadow-sm">
                        <img
                          src={event.image || "https://source.unsplash.com/400x300/?event"}
                          className="card-img-top"
                          alt={event.title}
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{event.title}</h5>
                          <p className="text-muted mb-2">{event.event_date}</p>
                          <button
                            className="btn btn-outline-primary mt-auto"
                            onClick={() => navigate(`/host/edit/${event.event_id}`)}
                          >
                            Edit Event
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Profile;
