import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1>Plan Your Events Effortlessly</h1>
            <p className="lead">
              Discover, host, and manage amazing events with ease.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Explore Events
            </button>
          </div>

          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1"
              className="img-fluid rounded"
              alt="event"
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container my-5" id="services">
        <h2 className="text-center mb-4">Our Services</h2>
        <div className="row">
          {["Wedding", "Corporate", "Birthday", "Concert", "Conference", "Launch"].map(
            (service, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card p-3 text-center">
                  <h5>{service} Events</h5>
                  <p>Professional planning and execution.</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container my-5" id="gallery">
        <h2 className="text-center mb-4">Gallery</h2>
        <div className="row">
          {[1, 2, 3, 4, 5, 6].map((img) => (
            <div className="col-md-4 mb-3" key={img}>
              <img
                src={`https://source.unsplash.com/400x300/?event,party&sig=${img}`}
                className="img-fluid rounded"
                alt="gallery"
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
