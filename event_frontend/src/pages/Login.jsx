import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveTokens } from "../api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email,
          password: formData.password
        }) 
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // ✅ Save JWT token - handle both single token and access_token format
      if (data.access_token) {
        saveTokens({ access_token: data.access_token, refresh_token: data.refresh_token });
      } else if (data.token) {
        // Fallback for backend returning 'token' field
        saveTokens({ access_token: data.token });
        localStorage.setItem("token", data.token);
      }

      navigate("/dashboard");

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

        {/* Logo */}
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

        <form onSubmit={handleSubmit}>
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
          <div className="mb-4">
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

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-4 border-top pt-3">
          <span className="text-muted">
            New user?{" "}
            <Link to="/signup" className="fw-semibold text-decoration-none">
              Register
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;
