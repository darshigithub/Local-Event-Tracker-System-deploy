import React, { useState } from "react";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    category: "",
    startTime: "",
    endTime: "",
    eventDate: "",
    venue: "",
    contactEmail: "",
    contactPhone: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0">
        <div className="card-header text-center bg-white">
          <h4 className="fw-bold text-uppercase">You're Host Now</h4>
        </div>

        <div className="card-body px-4">
          <form onSubmit={handleSubmit}>
            {/* Event Details */}
            <h6 className="fw-bold mb-3">Event Details</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="border rounded text-center p-4 h-100">
                  <p className="fw-semibold">Upload Image</p>
                  <small className="text-muted">
                    JPEG or PNG, up to 5MB
                  </small>
                  <input
                    type="file"
                    className="form-control mt-3"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-8">
                <label className="fw-semibold">Event Name</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  name="eventName"
                  onChange={handleChange}
                />

                <label className="fw-semibold">Description</label>
                <textarea
                  className="form-control mb-3"
                  rows="3"
                  name="description"
                  onChange={handleChange}
                ></textarea>

                <label className="fw-semibold">Category</label>
                <select
                  className="form-select"
                  name="category"
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option>Music</option>
                  <option>Technology</option>
                  <option>Sports</option>
                  <option>Education</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <hr className="my-4" />
            <h6 className="fw-bold mb-3">Duration of the Event</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="fw-semibold">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="startTime"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  name="endTime"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Date */}
            <hr className="my-4" />
            <h6 className="fw-bold mb-3">Date + Time</h6>
            <label className="fw-semibold">Event Date</label>
            <input
              type="date"
              className="form-control"
              name="eventDate"
              onChange={handleChange}
            />

            {/* Location */}
            <hr className="my-4" />
            <h6 className="fw-bold mb-3">Location</h6>
            <label className="fw-semibold">Venue Address</label>
            <input
              type="text"
              className="form-control"
              name="venue"
              onChange={handleChange}
            />

            {/* Contact */}
            <hr className="my-4" />
            <h6 className="fw-bold mb-3">Contact & Support</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="fw-semibold">Contact Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="contactEmail"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="fw-semibold">Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="contactPhone"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="text-center mt-4">
              <button className="btn btn-primary btn-lg px-5">
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
