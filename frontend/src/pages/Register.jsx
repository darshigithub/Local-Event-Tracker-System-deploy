import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Registration successful 🎉");
      navigate("/login");

    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: "420px" }}>
        <div className="card-body text-center border-bottom">
          <h4 className="fw-bold text-primary">EventSphere</h4>
        </div>

        <form onSubmit={handleSubmit} className="card-body px-4">
          {error && <div className="alert alert-danger">{error}</div>}

          <label className="fw-semibold">Name</label>
          <input
            name="name"
            className="form-control mb-3"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="fw-semibold">Email</label>
          <input
            name="email"
            type="email"
            className="form-control mb-3"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="fw-semibold">Password</label>
          <input
            name="password"
            type="password"
            className="form-control mb-3"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label className="fw-semibold">Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            className="form-control mb-4"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            className="btn btn-primary w-100 btn-lg"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="card-footer text-center bg-white">
          Already a user? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
