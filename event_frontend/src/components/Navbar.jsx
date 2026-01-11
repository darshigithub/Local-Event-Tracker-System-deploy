import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("user_name");
    const profilePic = localStorage.getItem("profile_pic"); // optional 

    if (accessToken && userId && username) {
      setUser({ userId, username, profilePic });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    // Remove tokens and user info
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("profile_pic");
    setUser(null);
    navigate("/login");
  };

  const handleLoginSignupClick = (path) => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4 py-2">
      {/* Logo */}
      <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
        <img
          src="https://logodix.com/logo/2045192.png"
          alt="logo"
          className="me-2 rounded-circle"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
        Event Organizer
      </Link>


      {/* Toggler for mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar links */}
      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/#gallery">Gallery</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/#services">Services</a>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>

          {user ? (
            // --------- Logged-in User Dropdown ---------
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    user.profilePic ||
                    "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001877.png"
                  }
                  alt="profile"
                  className="rounded-circle me-2"
                  style={{ width: "35px", height: "35px", objectFit: "cover" }}
                />
                {user.username}
              </a>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/host">
                    ➕ Create Event
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    🧾 Profile
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
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            // --------- Guest Dropdown ---------
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Account
              </a>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleLoginSignupClick("/login")}
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleLoginSignupClick("/signup")}
                  >
                    Signup
                  </button>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
