import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img
          src="https://via.placeholder.com/40"
          alt="logo"
          className="me-2"
        />
        Event Organizer
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              Menu
            </a>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#gallery">Gallery</a></li>
              <li><a className="dropdown-item" href="#services">Services</a></li>
              <li><Link className="dropdown-item" to="/login">Login</Link></li>
              <li><Link className="dropdown-item" to="/signup">Signup</Link></li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
