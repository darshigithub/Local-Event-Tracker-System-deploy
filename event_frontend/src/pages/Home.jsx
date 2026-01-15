git  Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", profilePic: "" });

  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    const profilePic = localStorage.getItem("profile_pic") || "";
    setUser({ username, profilePic });
  }, []);

  const handleExploreClick = () => {
    if (user.username) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />

      {/* ---------------- HERO SECTION ---------------- */}
      <div className="container my-5 py-5">
        <div className="row align-items-center">

          {/* LEFT */}
          <div className="col-md-6">
            <h1 className="display-4 fw-bold d-flex align-items-center">
              {user.username ? (
                <>
                  <img
                    src={user.profilePic || "https://via.placeholder.com/50"}
                    alt="profile"
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  Welcome back, {user.username}!
                </>
              ) : (
                <span style={{ color: "#0d3b66" }}> {/* Dark Blue */}
                  Manage & Explore Events Effortlessly
                </span>
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

          {/* RIGHT (Images) */}
          <div className="col-md-6 d-flex justify-content-center">
            <div
              className="position-relative"
              style={{ width: "420px", height: "320px" }}
            >
              <img
                src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
                alt="concert"
                className="position-absolute top-0 start-0 rounded-4 shadow-lg"
                style={{ width: "100%", height: "240px", objectFit: "cover" }}
              />

              <img
                src="https://th.bing.com/th/id/OIP.cjEr7Rm5CG8zeRk2NGsnSQHaFE?w=276&h=188&c=7&r=0&o=7&pid=1.7&rm=3"
                alt="conference"
                className="position-absolute rounded-4 shadow"
                style={{
                  width: "250px",
                  height: "140px",
                  objectFit: "cover",
                  top: "40px",
                  right: "-40px",
                  border: "4px solid #fff",
                }}
              />

              <img
                src="https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac"
                alt="wedding"
                className="position-absolute rounded-4 shadow"
                style={{
                  width: "270px",
                  height: "180px",
                  objectFit: "cover",
                  bottom: "-20px",
                  right: "-20px",
                  border: "4px solid #fff",
                }}
              />
            </div>
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
              <div className="card shadow-sm border-0 p-4 text-center h-100">
                <img
                  src={`/images/services/${service.file}`}
                  alt={service.name}
                  className="rounded mb-3"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                  }}
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
          {[
            {
              alt: "Music Festival",
              src: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae",
            },
            {
              alt: "Luxury Wedding Event",
              src: "https://images.unsplash.com/photo-1519741497674-611481863552",
            },
            {
              alt: "Corporate Conference",
              src: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
            },
            {
              alt: "Birthday Party Celebration",
              src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
            },
            {
              alt: "Holi Festival Celebration",
              src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
            },
            {
              alt: "Product Launch Event",
              src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
            },
          ].map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <img
                src={`${item.src}?auto=format&fit=crop&w=900&q=80`}
                alt={item.alt}
                className="img-fluid rounded-4 shadow"
                style={{
                  width: "100%",
                  height: "230px",
                  objectFit: "cover",
                }}
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
