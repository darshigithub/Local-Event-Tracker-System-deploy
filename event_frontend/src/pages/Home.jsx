import Navbar from "../components/Navbar";
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

  // Dummy images for services categories
  const serviceImages = [
    "https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515165562835-c9b1b74ff8e8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1486308510493-aa648336d17d?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div
        className="position-relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "500px"
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", top: 0, left: 0 }}
        ></div>

        <div className="container position-relative text-center text-white" style={{ zIndex: 1, paddingTop: "120px", paddingBottom: "100px" }}>
          <h1 className="display-4 fw-bold mb-3">
            {user.username ? `Welcome back, ${user.username}!` : "Discover Amazing Experiences"}
          </h1>
          <p className="lead mb-4">
            {user.username
              ? "Find and book unique activities, attractions, and experiences."
              : "Book tickets to attractions, activities, and experiences worldwide. Best prices guaranteed!"}
          </p>

          {/* Search Bar */}
          <div className="d-flex justify-content-center">
            <div className="position-relative" style={{ maxWidth: "700px", width: "100%" }}>
              <div className="bg-white shadow-lg d-flex align-items-center" style={{ borderRadius: "8px", overflow: "hidden" }}>
                <div className="ps-4 pe-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  name="keyword"
                  className="form-control border-0 flex-grow-1 py-3"
                  placeholder="Search events, artists, concerts..."
                  value={searchFilters.keyword}
                  onChange={handleSearchChange}
                  onClick={() => setShowFilters(true)}
                  style={{ fontSize: "1rem", outline: "none", backgroundColor: "transparent" }}
                />
                <button
                  className="btn px-4 py-3 fw-semibold"
                  onClick={handleSearch}
                  style={{ backgroundColor: "#ff5722", color: "white", borderRadius: "0 8px 8px 0", border: "none", minWidth: "100px" }}
                >
                  Search
                </button>
              </div>

              {showFilters && (
                <div className="bg-white shadow-lg mt-2 p-4" style={{ borderRadius: "12px", position: "absolute", top: "100%", left: 0, right: 0, zIndex: 1000 }}>
                  <div className="row">
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Date</label>
                      <input type="date" className="form-control" name="date" value={searchFilters.date} onChange={handleSearchChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Location</label>
                      <input type="text" className="form-control" name="location" placeholder="City" value={searchFilters.location} onChange={handleSearchChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Category</label>
                      <select name="category" className="form-select" value={searchFilters.category} onChange={handleSearchChange}>
                        {categories.map((cat, index) => <option key={index}>{cat}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="text-end mt-3">
                    <button className="btn btn-sm btn-secondary" onClick={() => setShowFilters(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-outline-light btn-lg px-5" onClick={handleExploreClick} style={{ borderRadius: "25px" }}>Explore All Activities</button>
          </div>
        </div>
      </div>

      {/* POPULAR CATEGORIES */}
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#ff5722" }}>Popular Categories</h2>
        <div className="row g-4">
          {["Attractions", "Tours", "Activities", "Shows & Events", "Food & Dining", "Transport"].map((cat, index) => (
            <div className="col-md-4" key={index}>
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 hover-zoom" style={{ cursor: "pointer" }}>
                <img src={serviceImages[index]} alt={cat} className="img-fluid" style={{ height: "200px", objectFit: "cover", width: "100%" }} />
                <div className="card-body text-center">
                  <h5 className="fw-bold" style={{ color: "#ff5722" }}>{cat}</h5>
                  <p className="text-muted">Discover amazing {cat.toLowerCase()} experiences</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED EXPERIENCES */}
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: "#ff5722" }}>Featured Experiences</h2>
        <div className="row g-4">
          {[...Array(6)].map((_, index) => (
            <div className="col-md-4" key={index}>
              <img src={`https://source.unsplash.com/800x600/?event,party,celebration,festival&sig=${index}`} alt={`Featured ${index}`} className="img-fluid rounded-4 shadow" style={{ height: "230px", objectFit: "cover", width: "100%" }} />
            </div>
          ))}
        </div>
      </div>

      <Footer />

      <style>{`
        .hover-zoom:hover {
          transform: scale(1.03);
          transition: transform 0.3s ease;
        }
      `}</style>
    </>
  );
}

export default Home;
