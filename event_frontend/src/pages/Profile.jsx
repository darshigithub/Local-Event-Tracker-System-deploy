import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchWithAuth, logoutUser } from "../api";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bookedEvents: [],
    hostedEvents: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const { ok, status, data } = await fetchWithAuth(
          "http://localhost:8080/api/profile"
        );

        console.log("PROFILE RESPONSE 👉", data);

        if (!ok) {
          if (status === 401) {
            logoutUser();
            navigate("/login");
            return;
          }

          setError(data?.message || "Failed to load profile");
          return;
        }

        // ✅ Defensive mapping
        setProfile({
          name: data?.name || "",
          email: data?.email || "",
          bookedEvents: data?.bookedEvents || [],
          hostedEvents: data?.hostedEvents || []
        });
      } catch (err) {
        setError("Server error while loading profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container my-5 alert alert-info text-center">
          Loading your profile...
        </div>
        <Footer />
      </>
    );
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container my-5 alert alert-danger text-center">
          {error}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container my-5">
        {/* ---------- USER INFO ---------- */}
        <div className="card shadow-sm mb-4">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h3 className="fw-bold mb-1">{profile.name}</h3>
              <p className="text-muted mb-0">{profile.email}</p>
            </div>

            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* ---------- BOOKED EVENTS ---------- */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3">🎟 Booked Events</h4>

          {profile.bookedEvents.length === 0 ? (
            <p className="text-muted">You have not booked any events yet.</p>
          ) : (
            <div className="row">
              {profile.bookedEvents.map((event) => (
                <div className="col-md-4 mb-3" key={event.eventId}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{event.title}</h5>
                      <p className="text-muted mb-2">
                        📅 {event.eventDate}
                        <br />
                        📍 {event.location}
                      </p>
                      <button
                        className="btn btn-primary mt-auto"
                        onClick={() =>
                          navigate(`/event/${event.eventId}`)
                        }
                      >
                        View Event
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------- HOSTED EVENTS ---------- */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3">🎤 Hosted Events</h4>

          {profile.hostedEvents.length === 0 ? (
            <p className="text-muted">You have not hosted any events yet.</p>
          ) : (
            <div className="row">
              {profile.hostedEvents.map((event) => (
                <div className="col-md-4 mb-3" key={event.eventId}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{event.title}</h5>
                      <p className="text-muted mb-2">
                        📅 {event.eventDate}
                        <br />
                        {event.bookingOpen ? (
                          <span className="text-success">Booking Open</span>
                        ) : (
                          <span className="text-danger">Booking Closed</span>
                        )}
                      </p>
                      <button
                        className="btn btn-outline-primary mt-auto"
                        onClick={() =>
                          navigate(`/host/edit/${event.eventId}`)
                        }
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
      </div>

      <Footer />
    </>
  );
}

export default Profile;
