import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", profilePic: "" });

  // Sync with localStorage for username and profile pic
  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    const profilePic = localStorage.getItem("profile_pic") || "";
    setUser({ username, profilePic });
  }, []);

  const handleExploreClick = () => {
    if (user.username) {
      navigate("/dashboard"); // Logged-in users → dashboard
    } else {
      navigate("/login"); // Guests → login
    }
  };

  return (
    <>
      <Navbar />

      {/* ---------------- HERO SECTION ---------------- */}
      <div className="container my-5 py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="display-4 fw-bold d-flex align-items-center">
              {user.username ? (
                <>
                  {/* Profile Avatar */}
                  <img
                    src={
                      user.profilePic || "https://via.placeholder.com/50"
                    }
                    alt="profile"
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  Welcome back, {user.username}!
                </>
              ) : (
                "Manage & Explore Events Effortlessly"
              )}
            </h1>

            <p className="lead text-secondary mt-3">
              {user.username
                ? "Discover amazing events or manage your own with ease."
                : "Discover stunning events, create your own, and join an energetic community — all in one place."}
            </p>

            <button
              className="btn btn-primary btn-lg mt-3"
              onClick={handleExploreClick}
            >
              Explore Events
            </button>
          </div>

          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1"
              className="img-fluid rounded shadow"
              alt="event"
            />
          </div>
        </div>
      </div>

      {/* ---------------- SERVICES SECTION ---------------- */}
      <div className="container my-5" id="services">
        <h2 className="text-center fw-bold mb-4">Our Services</h2>

        <div className="row">
          {[
            { name: "Wedding", file: "wedding.jfif" },
            { name: "Corporate", file: "corporate.jfif" },
            { name: "Birthday", file: "birthday.jfif" },
            { name: "Concert", file: "concert.jfif" },
            { name: "Conference", file: "conference.jfif" },
            { name: "Product Launch", file: "product-launch.jfif" },
          ].map((service, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card shadow-sm border-0 p-4 text-center h-50">
                <img
                  src={`/images/services/${service.file}`}
                  className="img-fluid rounded mb-3 service-img"
                  alt={service.name}
                />
                <h5 className="fw-bold">{service.name} Events</h5>
                <p className="text-muted">
                  End-to-end professional event planning and management.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- GALLERY SECTION ---------------- */}
      <div className="container my-5" id="gallery">
        <h2 className="text-center fw-bold mb-4">Gallery</h2>

        <div className="row">
          {[1, 2, 3, 4, 5, 6].map((img) => (
            <div className="col-md-4 mb-3" key={img}>
              <img
                src={`https://source.unsplash.com/500x350/?event,party&sig=${img}`}
                className="img-fluid rounded shadow"
                alt="gallery"
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
