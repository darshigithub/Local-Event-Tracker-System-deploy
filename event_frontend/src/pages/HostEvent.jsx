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
    eventDate: "",
    startTime: "",
    endTime: "",
    totalSeats: "",
    price: "",
    location: "",
    googleMapUrl: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.eventDate || !formData.startTime || !formData.endTime) {
      setError("Date, start time and end time are required");
      return;
    }

    if (Number(formData.totalSeats) <= 0) {
      setError("Total seats must be greater than 0");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        googleMapUrl: formData.googleMapUrl,
        eventDate: formData.eventDate,        // LocalDate
        startTime: formData.startTime,        // LocalTime
        endTime: formData.endTime,            // LocalTime
        totalSeats: Number(formData.totalSeats),
        availableSeats: Number(formData.totalSeats),
        price: Number(formData.price),
        bookingOpen: true
      };

      const res = await fetchWithAuth("http://localhost:8080/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create event");
      }

      setSuccess("🎉 Event created successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      console.error(err);
      setError(err.message || "Server error. Please try again.");
    }
  };

  // ---------------- UI ----------------
  return (
    <>
      <Navbar />

      <div className="container my-5">
        <h2 className="text-center mb-4 text-primary">YOU'RE A HOST NOW 🎤</h2>

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
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Total Seats */}
              <div className="col-md-3 mb-3">
                <label className="form-label">Total Seats</label>
                <input
                  type="number"
                  className="form-control"
                  name="totalSeats"
                  min="1"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Price */}
              <div className="col-md-3 mb-3">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
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

              {/* Date */}
              <div className="col-md-4 mb-3">
                <label className="form-label">Event Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Start Time */}
              <div className="col-md-4 mb-3">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* End Time */}
              <div className="col-md-4 mb-3">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Location */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {/* Google Map URL */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Google Map URL</label>
                <input
                  type="url"
                  className="form-control"
                  name="googleMapUrl"
                  value={formData.googleMapUrl}
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
