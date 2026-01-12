import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { saveTokens } from "../api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed"); return; }

      // Save tokens
      saveTokens({ access_token: data.access_token, refresh_token: data.refresh_token });

      localStorage.setItem("user_id", data.user.user_id);
      localStorage.setItem("user_name", data.user.name);

      navigate("/dashboard");
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
              <h2 className="text-center mb-4 text-primary">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" className="form-control mb-3" value={formData.email} onChange={handleChange} required/>
                <input type="password" name="password" placeholder="Password" className="form-control mb-3" value={formData.password} onChange={handleChange} required/>
                <button type="submit" className="btn btn-primary w-100 py-2">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
