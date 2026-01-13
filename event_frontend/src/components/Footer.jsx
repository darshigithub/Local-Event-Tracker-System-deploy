import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";


function Footer() {
  return (
    <footer className="bg-light text-dark p-4 mt-5 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        
        {/* Logo + Text */}
        <div className="d-flex align-items-center">
          <img
            src="https://i.postimg.cc/c6mRFy7y/Vibrant-sw-irling-gradient-logo.png"
            alt="logo"
            className="me-2"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
          <span style={{ color: "#007bff", fontWeight: "bold", fontSize: "1.25rem" }}>
            EventSphere
          </span>
        </div>

        {/* Social Icons */}
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
