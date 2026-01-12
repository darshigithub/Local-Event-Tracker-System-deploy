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
    imageFile: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState(null);

  // Load JWT token
  useEffect(() => {
    const jwtToken = localStorage.getItem("access_token");
    if (jwtToken) {
      setToken(jwtToken);
    } else {
      setError("You must be logged in to create an event");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("You must be logged in to create an event");
      return;
    }

    try {
      const form = new FormData();

      // Append all fields except image
      Object.keys(formData).forEach((key) => {
        if (key !== "imageFile") {
          form.append(key, formData[key]);
        }
      });

      // Append image if selected
      if (formData.imageFile) {
        form.append("image", formData.imageFile);
      }

      console.log(formData.imageFile);
      

      // Send POST request with JWT token
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // JWT token in header
        },
        body: form
      });

      // Parse JSON response
      const data = await response.json(); 

      if (!response.ok) {
        setError(data.error || "Failed to create event");
        if (response.status === 401) {
          localStorage.removeItem("jwt_token");
          window.location.href = "/login"; // Redirect to login if token expired
        }
        return;
      }

      setSuccess("Event created successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      console.error("Event creation error:", err);
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

              {/* Image Upload */}
              <div className="col-12 mb-3">
                <label className="form-label">Event Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, imageFile: e.target.files[0] })
                  }
                />
              </div>

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
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Google Maps Link */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Google Maps Link</label>
                <input
                  type="url"
                  className="form-control"
                  name="gogle_map_link"
                  value={formData.gogle_map_link}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mt-3">
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
