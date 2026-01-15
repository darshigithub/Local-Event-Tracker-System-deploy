import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchWithAuth } from "../api";

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
    address: "",
    google_map_link: "",
    imageFile: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔥 HARD VALIDATION (prevents DB crash)
    if (!formData.imageFile) {
      setError("Event image is required");
      return;
    }

    try {
      const form = new FormData();

      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("start_time", formData.start_time);
      form.append("end_time", formData.end_time);
      form.append("event_date", formData.event_date);
      form.append("capacity", formData.capacity);
      form.append("price", formData.price);
      form.append("address", formData.address);
      form.append("google_map_link", formData.google_map_link);

      // ✅ MUST MATCH backend key
      form.append("image", formData.imageFile);

      const res = await fetchWithAuth(
        "http://localhost:5000/api/events",
        {
          method: "POST",
          body: form
          // ❌ DO NOT add Content-Type
        }
      );

      if (!res.ok) {
        setError(res.data?.error || "Failed to create event");
        return;
      }

      setSuccess("Event created successfully 🎉");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  // ---------------- UI ----------------
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

              {/* Image */}
              <div className="col-12 mb-3">
                <label className="form-label">Event Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </div>

              {/* Title */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
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
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Times */}
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

              {/* Google Map */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Google Maps Link</label>
                <input
                  type="url"
                  className="form-control"
                  name="google_map_link"
                  value={formData.google_map_link}
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