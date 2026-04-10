import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  // 🔥 Scroll navigation
  const handleScrollNavigation = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2 sticky-top">

      {/* 🔷 Logo */}
      <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
        <img
          src="https://i.postimg.cc/c6mRFy7y/Vibrant-sw-irling-gradient-logo.png"
          alt="logo"
          className="me-2"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
        <span style={{ color: "#0d6efd", fontSize: "1.3rem" }}>
          EventSphere
        </span>
      </Link>

      {/* 🔷 Mobile Toggle */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* 🔷 Nav Links */}
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav align-items-center gap-2">

          {/* Home */}
          <li className="nav-item">
            <Link
              className={`nav-link nav-hover ${isActive("/") ? "active-link" : ""}`}
              to="/"
            >
              Home
            </Link>
          </li>

          {/* Services */}
          <li className="nav-item">
            <span
              className="nav-link nav-hover"
              onClick={() => handleScrollNavigation("services")}
            >
              Services
            </span>
          </li>

          {/* Gallery */}
          <li className="nav-item">
            <span
              className="nav-link nav-hover"
              onClick={() => handleScrollNavigation("gallery")}
            >
              Gallery
            </span>
          </li>

          {/* Analytics */}
          {isLoggedIn && (
            <li className="nav-item">
              <Link
                className={`btn btn-outline-primary rounded-pill px-3 ${
                  isActive("/analytics") ? "active-btn" : ""
                }`}
                to="/analytics"
              >
                Analytics
              </Link>
            </li>
          )}

          {/* Dashboard */}
          {isLoggedIn && (
            <li className="nav-item">
              <Link
                className={`btn btn-outline-primary rounded-pill px-3 ${
                  isActive("/dashboard") ? "active-btn" : ""
                }`}
                to="/dashboard"
              >
                Dashboard
              </Link>
            </li>
          )}

          {/* 🔷 Account Dropdown */}
          <li className="nav-item dropdown ms-3">
            <button
              className="btn btn-outline-warning rounded-pill dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              {isLoggedIn ? "My Account" : "Account"}
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">

              {!isLoggedIn ? (
                <>
                  <li>
                    <Link className="dropdown-item" to="/login">Login</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/signup">Signup</Link>
                  </li>
                </>
              ) : (
                <>
                  {/* Logout only */}
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

            </ul>
          </li>

        </ul>
      </div>

      {/* 🔥 Styles */}
      <style>
        {`
          .nav-hover {
            color: #333;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
          }

          .nav-hover:hover {
            color: #0d6efd;
            transform: translateY(-1px);
          }

          .active-link {
            color: #0d6efd !important;
            font-weight: 600;
          }

          .active-btn {
            background-color: #0d6efd;
            color: white !important;
          }

          .navbar {
            backdrop-filter: blur(8px);
          }
        `}
      </style>
    </nav>
  );
}

export default Navbar;