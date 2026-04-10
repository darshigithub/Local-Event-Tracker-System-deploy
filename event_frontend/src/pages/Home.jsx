import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api"; 

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", profilePic: "" });
  const [topEvents, setTopEvents] = useState([]); 

  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    const profilePic = localStorage.getItem("profile_pic") || "";
    setUser({ username, profilePic });

    const fetchEvents = async () => {  
      try {
        const res = await api.get("/events");
        const eventList = res.data?.events || [];

        const updatedEvents = eventList.map((event) => {
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

        setTopEvents(updatedEvents.slice(0, 3)); // Show only top 3
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
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

      {/* HERO SECTION */}
      <div
        className="position-relative text-white text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px"
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        ></div>

        <div
          className="container position-relative"
          style={{ zIndex: 1, paddingTop: "120px", paddingBottom: "100px" }}
        >
          <h1 className="display-4 fw-bold mb-3">
            {user.username
              ? `Welcome back, ${user.username}!`
              : "Discover & Book Amazing Events"}
          </h1>

          <p className="lead mb-4">
            Explore concerts, workshops, festivals and more — all in one place.
          </p>

          <button
            className="btn btn-warning btn-lg px-5 rounded-pill fw-semibold"
            onClick={handleExploreClick}
          >
            Explore Events
          </button>
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div id="services" className="container my-5">
        <h2 className="text-center fw-bold mb-4">✨ Our Services</h2>

        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="p-4 shadow-sm rounded-4">
              <h5 className="fw-bold">Music Events</h5>
              <p className="text-muted">
                Discover concerts, DJ nights and live performances.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-4 shadow-sm rounded-4">
              <h5 className="fw-bold">Corporate Events</h5>
              <p className="text-muted">
                Conferences, meetings and professional gatherings.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-4 shadow-sm rounded-4">
              <h5 className="fw-bold">Workshops & Seminars</h5>
              <p className="text-muted">
                Learning sessions, training programs and skill development.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-4 shadow-sm rounded-4">
              <h5 className="fw-bold">Sports Events</h5>
              <p className="text-muted">
                Matches, tournaments and fitness competitions.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-4 shadow-sm rounded-4">
              <h5 className="fw-bold">Private Events</h5>
              <p className="text-muted">
                Weddings, birthdays and special celebrations.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-4 shadow-sm rounded-4">
              <h5 className="fw-bold">Food & Festivals</h5>
              <p className="text-muted">
                Explore food fests, cultural festivals and exhibitions.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* GALLERY SECTION */}
      <div id="gallery" className="container my-5">
        <h2 className="text-center fw-bold mb-4">📸 Event Gallery</h2>

        <div className="row">
          {[
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            "https://images.unsplash.com/photo-1527549993586-dff825b37782",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
          ].map((img, i) => (
            <div key={i} className="col-md-4 mb-4">
              <img
                src={`${img}?auto=format&fit=crop&w=800&q=80`}
                alt="gallery"
                className="img-fluid rounded-4 shadow-sm"
                style={{ height: "200px", objectFit: "cover", width: "100%" }}
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