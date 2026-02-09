import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔄 Sync login state with token
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

  const linkStyle = { color: "#ff5722" };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2">
      {/* Logo */}
      <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
        <img
          src="https://i.postimg.cc/c6mRFy7y/Vibrant-sw-irling-gradient-logo.png"
          alt="logo"
          className="me-2"
          style={{ width: "60px", height: "60px", objectFit: "cover" }}
        />
        <span style={{ color: "#007bff", fontSize: "1.25rem" }}>
          EventSphere
        </span>
      </Link>

      {/* Mobile toggle */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Links */}
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav align-items-center">
          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/" style={linkStyle}>
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link fw-semibold" to="/dashboard" style={linkStyle}>
              Dashboard
            </Link>
          </li>

          {isLoggedIn && (
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/host/event" style={linkStyle}>
                Category
              </Link>
            </li>
          )}

          {/* -------- ACCOUNT DROPDOWN -------- */}
          <li className="nav-item dropdown ms-3">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              data-bs-toggle="dropdown"
              style={{ color: "#ff5722", textDecoration: "none" }}
            >
              Account
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              {!isLoggedIn ? (
                <>
                  <li>
                    <Link className="dropdown-item" to="/login">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/signup">
                      Signup
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
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
    </nav>
  );
}

export default Navbar;
