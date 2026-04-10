import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { saveToken } from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

      const data = res.data;

      
      if (data.token) {
        saveToken(data.token);
      } else {
        setError("Token not received from server");
        return;
      }

     
      localStorage.setItem("user_id", data.userId);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_name", data.name);

    
      navigate("/dashboard");

    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Invalid email or password");
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
          <p className="text-muted small">Welcome back</p>
        </div>

        
        {error && (
          <div className="alert alert-danger text-center py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
         
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

          
          <div className="mb-4 position-relative">
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

         
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

       
        <div className="text-center mt-4 border-top pt-3">
          <span className="text-muted">
            New user?{" "}
            <Link
              to="/signup"
              className="fw-semibold text-decoration-none"
            >
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;