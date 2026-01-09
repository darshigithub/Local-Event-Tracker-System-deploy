import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function HostEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    start_time: "",
    end_time: "",
    event_date: "",
    capacity: "",
    price: "",
    status: "active",
    address: "",
    gogle_map_link: "",
    contact: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState(null);

  // ✅ Get user_id from localStorage when component mounts
  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (id) {
      setUserId(parseInt(id));
    } else {
      setError("You must be logged in to create an event");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("You must be logged in to create an event");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          ...formData,
          capacity: parseInt(formData.capacity),
          price: parseFloat(formData.price),
          status: formData.status.toLowerCase()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || "Failed to create event");
        return;
      }

      setSuccess("Event created successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center mb-4 text-primary">YOU'RE A HOST NOW</h2>

        <div className="card p-4 shadow">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Title */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Music">Music</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Conference">Conference</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Start/End Time */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Date */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Capacity */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Capacity</label>
                <input
                  type="number"
                  className="form-control"
                  name="capacity"
                  placeholder="Total seats"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Price */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  placeholder="Ticket price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Status */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Address */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="City / Venue"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Google Maps */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Google Maps Link</label>
                <input
                  type="url"
                  className="form-control"
                  name="gogle_map_link"
                  placeholder="Map link"
                  value={formData.gogle_map_link}
                  onChange={handleChange}
                />
              </div>

              {/* Contact */}
              <div className="col-12 mb-3">
                <label className="form-label">Contact & Support</label>
                <input
                  type="text"
                  className="form-control"
                  name="contact"
                  placeholder="Email or Phone"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mt-3" disabled={!userId}>
              Publish Event
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default HostEvent;
