import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const isStrongPassword = (password) => {
    return password.length >= 6; r
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isStrongPassword(formData.password)) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setSuccess("Registration successful! Redirecting...");

      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Registration failed");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd, #f8f9fa)"
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{ width: "420px", borderRadius: "15px" }}
      >
        
        <div className="text-center mb-3">
          <img
            src="https://i.postimg.cc/c6mRFy7y/Vibrant-sw-irling-gradient-logo.png"
            alt="EventSphere"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
          <h4 className="mt-2 fw-bold text-primary">EventSphere</h4>
          <p className="text-muted small">Create your account</p>
        </div>

       
        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}
        {success && (
          <div className="alert alert-success py-2 text-center">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
         
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control rounded-3"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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

          
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control rounded-3"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer"
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          
          <div className="mb-4 position-relative">
            <label className="form-label fw-semibold">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control rounded-3"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer"
              }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        
        <div className="text-center mt-4 border-top pt-3">
          <span className="text-muted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="fw-semibold text-decoration-none"
            >
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;