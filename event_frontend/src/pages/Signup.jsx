import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { saveTokens } from "../api";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed"); return; }

      // Save tokens
      saveTokens({ access_token: data.access_token, refresh_token: data.refresh_token });

      localStorage.setItem("user_id", data.user.user_id);
      localStorage.setItem("user_name", data.user.name);

      setSuccess("Registration successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 2000);

    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg border-0 rounded-3 p-4">
              <h2 className="text-center mb-4 text-primary">Sign Up</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" className="form-control mb-3" value={formData.name} onChange={handleChange} required/>
                <input type="email" name="email" placeholder="Email" className="form-control mb-3" value={formData.email} onChange={handleChange} required/>
                <input type="password" name="password" placeholder="Password" className="form-control mb-3" value={formData.password} onChange={handleChange} required/>
                <input type="password" name="confirmPassword" placeholder="Confirm Password" className="form-control mb-3" value={formData.confirmPassword} onChange={handleChange} required/>
                <button type="submit" className="btn btn-primary w-100 py-2">Register</button>
              </form>
              <div className="text-center mt-3">
                <small>Already have an account? <Link to="/login">Login</Link></small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Signup;
