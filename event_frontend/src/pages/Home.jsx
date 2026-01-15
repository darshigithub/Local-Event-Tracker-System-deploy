git  Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", profilePic: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    keyword: "",
    date: "",
    location: "",
    category: ""
  });

  const categories = [
    "All Categories",
    "Music Concert",
    "Conference",
    "Wedding",
    "Birthday Party",
    "Corporate Event",
    "Sports",
    "Festival",
    "Workshop",
    "Exhibition"
  ];

  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    const profilePic = localStorage.getItem("profile_pic") || "";
    setUser({ username, profilePic });

    // Fetch events for search suggestions
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const res = await fetch("http://localhost:5000/api/events", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            const eventList = data.events || [];
            
            // Convert binary buffer -> base64 for images
            const updatedEvents = eventList.map((event) => {
              if (event.image && Array.isArray(event.image)) {
                const base64 = btoa(
                  new Uint8Array(event.image).reduce(
                    (d, byte) => d + String.fromCharCode(byte),
                    ""
                  )
                );
                return { ...event, image: `data:image/jpeg;base64,${base64}` };
              }
              return event;
            });
            
            setEvents(updatedEvents);
            // Get top 3 events for suggestions
            setTopEvents(updatedEvents.slice(0, 3));
          }
        }
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

  const handleSearchChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchFilters.keyword) params.append("keyword", searchFilters.keyword);
    if (searchFilters.date) params.append("date", searchFilters.date);
    if (searchFilters.location) params.append("location", searchFilters.location);
    if (searchFilters.category && searchFilters.category !== "All Categories") {
      params.append("category", searchFilters.category);
    }
    navigate(`/dashboard?${params.toString()}`);
    setShowFilters(false);
  };



  return (
    <>
      <Navbar />

      {/* ---------------- HERO SECTION WITH SEARCH (Klook Style) ---------------- */}
      <div
        className="position-relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px"
        }}
      >
        {/* Dark Overlay */}
        <div
          className="position-absolute w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", top: 0, left: 0 }}
        ></div>

        {/* Content */}
        <div className="container position-relative" style={{ zIndex: 1, paddingTop: "100px", paddingBottom: "100px" }}>
          <div className="text-center text-white mb-5">
            <h1 className="display-4 fw-bold mb-3">
              {user.username ? (
                <>Welcome back, {user.username}!</>
              ) : (
                <>Discover Amazing Experiences</>
              )}
            </h1>
            <p className="lead">
              {user.username
                ? "Find and book unique activities, attractions, and experiences."
                : "Book tickets to attractions, activities, and experiences worldwide. Best prices guaranteed!"}
            </p>
          </div>

          {/* Search Bar (Klook Style - Exact Match) */}
          <div className="d-flex justify-content-center">
            <div className="position-relative" style={{ maxWidth: "700px", width: "100%" }}>
              {/* Search Input Container */}
              <div
                className="bg-white shadow-lg d-flex align-items-center"
                style={{ 
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
              >
                {/* Search Icon */}
                <div className="ps-4 pe-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  name="keyword"
                  className="form-control border-0 flex-grow-1 py-3"
                  placeholder="Search events, artists, concerts..."
                  value={searchFilters.keyword}
                  onChange={handleSearchChange}
                  onClick={() => setShowFilters(true)}
                  style={{ 
                    fontSize: "1rem", 
                    outline: "none", 
                    boxShadow: "none",
                    backgroundColor: "transparent"
                  }}
                />

                {/* Search Button */}
                <button
                  className="btn px-4 py-3 fw-semibold"
                  onClick={handleSearch}
                  style={{
                    backgroundColor: "#ff5722",
                    color: "white",
                    borderRadius: "0 8px 8px 0",
                    border: "none",
                    minWidth: "100px"
                  }}
                >
                  Search
                </button>
              </div>

              {/* Dropdown Panel (Shows when clicking input) */}
              {showFilters && (
                <div
                  className="bg-white shadow-lg mt-2 p-4"
                  style={{
                    borderRadius: "12px",
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    right: "0",
                    zIndex: 1000
                  }}
                >
                  {/* Other travelers searched for */}
                  <p className="text-muted fw-semibold mb-3">Other travelers searched for</p>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {["music concert", "wedding", "birthday party", "conference", "festival", "sports"].map((tag, index) => (
                      <span
                        key={index}
                        className="badge bg-light text-dark px-3 py-2"
                        style={{ 
                          borderRadius: "20px", 
                          cursor: "pointer",
                          border: "1px solid #ddd",
                          fontSize: "0.9rem"
                        }}
                        onClick={() => {
                          setSearchFilters({ ...searchFilters, keyword: tag });
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="row">
                    {/* Top searches - From actual events */}
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3" style={{ color: "#333" }}>Top searches</h6>
                      {topEvents.length > 0 ? (
                        topEvents.map((event, index) => (
                          <div
                            key={event.event_id}
                            className="d-flex align-items-center mb-3 p-2"
                            style={{ 
                              cursor: "pointer",
                              borderRadius: "8px",
                              borderLeft: "4px solid #ff5722"
                            }}
                            onClick={() => {
                              navigate(`/event/${event.event_id}`);
                              setShowFilters(false);
                            }}
                          >
                            <span
                              className="badge me-3"
                              style={{ 
                                backgroundColor: "#ff5722", 
                                color: "white",
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              {index + 1}
                            </span>
                            {event.image && (
                              <img
                                src={event.image}
                                alt={event.title}
                                className="me-3"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "8px"
                                }}
                              />
                            )}
                            <div className="flex-grow-1">
                              <div className="fw-semibold" style={{ fontSize: "0.95rem" }}>{event.title}</div>
                              <small className="text-muted">{event.address}</small>
                            </div>
                            <span style={{ color: "#ff5722", fontWeight: "600" }}>From ₹{event.price}</span>
                          </div>
                        ))
                      ) : (
                        // Fallback if no events loaded
                        <p className="text-muted small">Login to see top events</p>
                      )}
                      
                      {/* Search in existing events */}
                      {events.length > 0 && searchFilters.keyword && (
                        <>
                          <h6 className="fw-bold mb-3 mt-4" style={{ color: "#333" }}>Matching events</h6>
                          {events
                            .filter(e => 
                              e.title.toLowerCase().includes(searchFilters.keyword.toLowerCase()) ||
                              e.address.toLowerCase().includes(searchFilters.keyword.toLowerCase())
                            )
                            .slice(0, 3)
                            .map((event) => (
                              <div
                                key={event.event_id}
                                className="d-flex align-items-center mb-2 p-2"
                                style={{ 
                                  cursor: "pointer",
                                  borderRadius: "8px",
                                  backgroundColor: "#f8f9fa"
                                }}
                                onClick={() => {
                                  navigate(`/event/${event.event_id}`);
                                  setShowFilters(false);
                                }}
                              >
                                {event.image && (
                                  <img
                                    src={event.image}
                                    alt={event.title}
                                    className="me-3"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      objectFit: "cover",
                                      borderRadius: "6px"
                                    }}
                                  />
                                )}
                                <div className="flex-grow-1">
                                  <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>{event.title}</div>
                                  <small className="text-muted">{event.address}</small>
                                </div>
                                <span style={{ color: "#ff5722", fontWeight: "600", fontSize: "0.85rem" }}>₹{event.price}</span>
                              </div>
                            ))}
                        </>
                      )}
                    </div>

                    {/* Trending destinations / Filters */}
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3" style={{ color: "#333" }}>Filter by</h6>
                      
                      {/* Date Filter */}
                      <div className="mb-3">
                        <label className="form-label text-muted small">Date</label>
                        <input
                          type="date"
                          name="date"
                          className="form-control"
                          value={searchFilters.date}
                          onChange={handleSearchChange}
                          style={{ borderRadius: "8px" }}
                        />
                      </div>

                      {/* Location Filter */}
                      <div className="mb-3">
                        <label className="form-label text-muted small">Location</label>
                        <input
                          type="text"
                          name="location"
                          className="form-control"
                          placeholder="e.g., Mumbai, Delhi..."
                          value={searchFilters.location}
                          onChange={handleSearchChange}
                          style={{ borderRadius: "8px" }}
                        />
                      </div>

                      {/* Category Filter */}
                      <div className="mb-3">
                        <label className="form-label text-muted small">Category</label>
                        <select
                          name="category"
                          className="form-select"
                          value={searchFilters.category}
                          onChange={handleSearchChange}
                          style={{ borderRadius: "8px" }}
                        >
                          {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Close button */}
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-sm"
                      onClick={() => setShowFilters(false)}
                      style={{ color: "#666" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Click outside to close */}
          {showFilters && (
            <div
              className="position-fixed w-100 h-100"
              style={{ top: 0, left: 0, zIndex: 999 }}
              onClick={() => setShowFilters(false)}
            ></div>
          )}

          {/* Explore Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-outline-light btn-lg px-5"
              onClick={handleExploreClick}
              style={{ borderRadius: "25px" }}
            >
              Explore All Activities
            </button>
          </div>
        </div>
      </div>
      {/* ---------------- CATEGORIES SECTION ---------------- */}
      <div className="container my-5" id="services">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#ff5722" }}>
          Popular Categories
        </h2>

        <div className="row">
          {[
            { name: "Attractions", file: "wedding.jfif", icon: "🎡" },
            { name: "Tours", file: "corporate.jfif", icon: "🗺️" },
            { name: "Activities", file: "birthday.jfif", icon: "🎉" },
            { name: "Shows & Events", file: "concert.jfif", icon: "🎭" },
            { name: "Food & Dining", file: "conference.jfif", icon: "🍽️" },
            { name: "Transport", file: "product-launch.jfif", icon: "🚗" },
          ].map((service, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div
                className="card shadow-sm border-0 p-4 text-center h-100"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
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
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{service.icon}</div>
                <h5 className="fw-bold" style={{ color: "#ff5722" }}>{service.name}</h5>
                <p className="text-muted">
                  Discover amazing {service.name.toLowerCase()} experiences
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- FEATURED EXPERIENCES SECTION ---------------- */}
      <div className="container my-5" id="gallery">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#ff5722" }}>
          Featured Experiences
        </h2>

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
