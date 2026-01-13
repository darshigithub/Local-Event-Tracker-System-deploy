import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveTokens } from "../api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      saveTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });

      localStorage.setItem("user_id", data.user.user_id);
      localStorage.setItem("user_name", data.user.name);

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f3f4f6" }}
    >
      <div className="card shadow-lg border-0 p-4" style={{ width: "420px" }}>

        {/* ⭐ Logo Section */}
        <div className="text-center mb-3">
          <img
            src="https://i.postimg.cc/c6mRFy7y/Vibrant-sw-irling-gradient-logo.png"
            alt="EventSphere"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
          <h4 className="mt-2 fw-bold text-primary">EventSphere</h4>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              type="text"
              name="name"
              className="form-control rounded-3"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control rounded-3"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control rounded-3"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control rounded-3"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 border-top pt-3">
          <span className="text-muted">
            Already existing user?{" "}
            <Link to="/login" className="fw-semibold text-decoration-none">
              Login
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}

export default Signup;
