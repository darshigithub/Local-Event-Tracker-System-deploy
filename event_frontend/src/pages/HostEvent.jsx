import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api";

function HostEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    totalSeats: "",
    price: "",
    location: "",
    googleMapUrl: ""
  });

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // ---------------- FETCH USERS ----------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load users");
        }
      }
    };

    if (token) fetchUsers();
  }, [navigate, token]);

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- ADD USER ----------------
  const addUser = (user) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (id) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== id));
  };

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    if (!formData.title || !formData.eventDate) {
      return "Title and Date are required";
    }
    if (formData.startTime >= formData.endTime) {
      return "End time must be after start time";
    }
    if (Number(formData.totalSeats) <= 0) {
      return "Seats must be greater than 0";
    }
    return null;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errMsg = validateForm();
    if (errMsg) return setError(errMsg);

    try {
      setLoading(true);

      const payload = {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        availableSeats: Number(formData.totalSeats),
        price: Number(formData.price),
        bookingOpen: true,
        participants: selectedUsers.map((u) => ({
          userId: u.id
        }))
      };

      await api.post("/events", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("✅ Event created successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
          err.response?.data ||
          "❌ Failed to create event"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTER USERS ----------------
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="container py-5" style={{ maxWidth: "900px" }}>

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">🎤 Host an Event</h2>
          <p className="text-muted">Create and manage your event easily</p>
        </div>

        {/* FORM CARD */}
        <div className="card border-0 shadow-lg rounded-4 p-4">

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-4">

              {/* TITLE */}
              <div className="col-12">
                <input
                  className="form-control form-control-lg rounded-3"
                  placeholder="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="col-12">
                <textarea
                  className="form-control rounded-3"
                  placeholder="Event Description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* DATE & TIME */}
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control rounded-3"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <input
                  type="time"
                  className="form-control rounded-3"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <input
                  type="time"
                  className="form-control rounded-3"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* SEATS & PRICE */}
              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control rounded-3"
                  placeholder="Total Seats"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control rounded-3"
                  placeholder="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* LOCATION */}
              <div className="col-md-6">
                <input
                  className="form-control rounded-3"
                  placeholder="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="url"
                  className="form-control rounded-3"
                  placeholder="Google Map URL"
                  name="googleMapUrl"
                  value={formData.googleMapUrl}
                  onChange={handleChange}
                />
              </div>

              {/* PARTICIPANTS */}
              <div className="col-12">
                <h6 className="fw-bold">👥 Add Participants</h6>

                <input
                  className="form-control mb-2 rounded-3"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="border rounded-3 p-2" style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-2 bg-light rounded mb-1"
                      style={{ cursor: "pointer" }}
                      onClick={() => addUser(user)}
                    >
                      {user.name} ({user.email})
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  {selectedUsers.map((user) => (
                    <span key={user.id} className="badge bg-primary me-2">
                      {user.name}
                      <span
                        className="ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => removeUser(user.id)}
                      >
                        ✖
                      </span>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-4 rounded-3 py-2"
              disabled={loading}
            >
              {loading ? "Creating..." : "🚀 Create Event"}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default HostEvent;