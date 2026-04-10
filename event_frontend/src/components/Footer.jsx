import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">

          <div className="col-md-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src="https://i.postimg.cc/c6mRFy7y/Vibrant-sw-irling-gradient-logo.png"
                alt="logo"
                className="me-2"
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
              <span style={{ color: "#ffc107", fontWeight: "bold", fontSize: "1.5rem" }}>
                EventSphere
              </span>
            </div>

            <p style={{ color: "#ccc" }}>
              Discover and book amazing events, concerts, workshops and
              experiences around you. Your one-stop destination for all events.
            </p>
          </div>

          <div className="col-md-2 mb-4">
            <h5 className="fw-bold mb-3 text-warning">Services</h5>
            <ul className="list-unstyled">
              <li className="footer-link">Music Events</li>
              <li className="footer-link">Corporate Events</li>
              <li className="footer-link">Private Events</li>
              <li className="footer-link">Workshops</li>
            </ul>
          </div>

          <div className="col-md-2 mb-4">
            <h5 className="fw-bold mb-3 text-warning">Company</h5>
            <ul className="list-unstyled">
              <li className="footer-link">About Us</li>
              <li className="footer-link">Careers</li>
              <li className="footer-link">Blog</li>
              <li className="footer-link">Contact</li>
            </ul>
          </div>

          <div className="col-md-2 mb-4">
            <h5 className="fw-bold mb-3 text-warning">Support</h5>
            <ul className="list-unstyled">
              <li className="footer-link">Help Center</li>
              <li className="footer-link">Terms</li>
              <li className="footer-link">Privacy Policy</li>
            </ul>
          </div>

          <div className="col-md-2 mb-4">
            <h5 className="fw-bold mb-3 text-warning">Follow Us</h5>
            <div className="d-flex">
              <FaFacebook className="me-3 social-icon" size={22} />
              <FaInstagram className="me-3 social-icon" size={22} />
              <FaTwitter className="me-3 social-icon" size={22} />
              <FaLinkedin className="social-icon" size={22} />
            </div>
          </div>

        </div>

        <hr style={{ borderColor: "#555" }} />

        <div className="text-center" style={{ color: "#aaa" }}>
          © {new Date().getFullYear()} EventSphere. All rights reserved.
        </div>
      </div>

      <style>
        {`
          .footer-link {
            color: #ccc;
            margin-bottom: 8px;
            cursor: pointer;
            transition: color 0.3s;
          }

          .footer-link:hover {
            color: #ffc107;
          }

          .social-icon {
            cursor: pointer;
            transition: transform 0.3s, color 0.3s;
          }

          .social-icon:hover {
            transform: scale(1.2);
            color: #ffc107;
          }
        `}
      </style>
    </footer>
  );
}

export default Footer;