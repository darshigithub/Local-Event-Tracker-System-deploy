import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-light p-4 mt-5">
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <h5>Event Organizer</h5>
          <p>© 2026 All rights reserved</p>
        </div>

        <div>
          <FaFacebook className="me-3" size={25} />
          <FaInstagram className="me-3" size={25} />
          <FaTwitter className="me-3" size={25} />
          <FaLinkedin size={25} />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
