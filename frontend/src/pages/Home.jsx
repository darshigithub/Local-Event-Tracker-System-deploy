import React from "react";
import { Link } from "react-router-dom";

/* -------------------- DATA -------------------- */
const services = ["Event Planning", "Venue Booking", "Catering & More"];
const galleryItems = [
    { name: "Concerts", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30" },
    { name: "Corporate Events", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f" },
    { name: "Weddings", img: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13" },
];

/* -------------------- NAVBAR -------------------- */
function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
                <a className="navbar-brand fw-bold d-flex align-items-center" href="/">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                        width="35"
                        className="me-2"
                    />
                    EventOrganizer
                </a>

                <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div id="nav" className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link fw-semibold" href="#services">Services</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link fw-semibold" href="#gallery">Gallery</a>
                        </li>
                        <li className="nav-item dropdown">
                            <button
                                className="nav-link dropdown-toggle btn btn-link"
                                data-bs-toggle="dropdown"
                            >
                                Account
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><Link className="dropdown-item" to="/login">Login</Link></li>
                                <li><Link className="dropdown-item" to="/register">Signup</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

/* -------------------- HERO -------------------- */
function Hero() {
    return (
        <section className="py-5 bg-light">
            <div className="container row align-items-center mx-auto">

                {/* Left content */}
                <div className="col-md-6">
                    <h1 className="fw-bold">Welcome to EventOrganizer</h1>
                    <p className="text-muted">
                        Organize and manage your events effortlessly with our all-in-one platform.
                        Handle registrations, schedules, and attendee engagement seamlessly.
                    </p>
                    <button className="btn btn-primary btn-lg">Explore Events</button>
                </div>

                {/* Right overlapping images */}
                <div className="col-md-6 position-relative d-flex justify-content-center">
                    <div
                        className="hero-images position-relative"
                        style={{ width: "450px", height: "330px" }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1506157786151-b8491531f063"
                            className="rounded shadow position-absolute"
                            style={{
                                top: 0,
                                left: 0,
                                width: "350px",
                                zIndex: 3,
                            }}
                            alt="Event 1"
                        />

                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                            className="rounded shadow position-absolute"
                            style={{
                                top: 60,
                                left: 70,
                                width: "350px",
                                zIndex: 2,
                            }}
                            alt="Event 2"
                        />

                        <img
                            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                            className="rounded shadow position-absolute"
                            style={{
                                top: 120,
                                left: 140,
                                width: "350px",
                                zIndex: 1,
                            }}
                            alt="Event 3"
                        />
                    </div>
                </div>
            </div>

            {/* Hover animation */}
            <style>{`
        .hero-images img {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hero-images img:hover {
          transform: scale(1.06) translateY(-6px);
          box-shadow: 0 14px 30px rgba(0,0,0,0.25);
        }
      `}</style>
        </section>
    );
}


/* -------------------- SERVICES -------------------- */
function Services() {
    const services = [
        { name: "Event Planning", icon: "fas fa-calendar-check", desc: "Comprehensive planning for all types of events." },
        { name: "Venue Booking", icon: "fas fa-building", desc: "Reserve the perfect venue for your special occasion." },
        { name: "Catering & More", icon: "fas fa-utensils", desc: "Delicious catering services tailored to your needs." }
    ];

    return (
        <section id="services" className="py-5 bg-light">
            <div className="container">
                <h3 className="fw-bold mb-5 text-center">Our Services</h3>
                <div className="row g-4">
                    {services.map((s) => (
                        <div key={s.name} className="col-md-4">
                            <div className="card h-100 text-center shadow-sm border-0 p-3 service-card">
                                <div className="mb-3">
                                    <i className={`${s.icon} fa-3x text-primary`}></i>
                                </div>
                                <h5 className="card-title fw-bold">{s.name}</h5>
                                <p className="card-text text-muted">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Optional CSS for hover effect */}
            <style>{`
        .service-card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease-in-out;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
      `}</style>
        </section>
    );
}

/* -------------------- GALLERY -------------------- */
function Gallery() {
    return (
        <section id="gallery" className="py-5 bg-light">
            <div className="container">
                <h3 className="fw-bold mb-4">Gallery</h3>
                <div className="row">
                    {galleryItems.map((g) => (
                        <div key={g.name} className="col-md-4 mb-3">
                            <div className="card h-100 shadow-sm">
                                <div
                                    className="overflow-hidden"
                                    style={{ height: "250px" }} // fixed height for all images
                                >
                                    <img
                                        src={g.img}
                                        className="card-img-top w-100 h-100"
                                        style={{ objectFit: "cover" }} // ensures the image covers the area
                                        alt={g.name}
                                    />
                                </div>
                                <div className="card-body text-center">
                                    <h5 className="card-title">{g.name}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* -------------------- FOOTER -------------------- */
function Footer() {
    return (
        <footer className="bg-dark text-light py-5">
            <div className="container">
                <div className="row align-items-center">

                    {/* Left Side: Logo + Company Name */}
                    <div className="col-md-4 d-flex align-items-center mb-3 mb-md-0">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                            width="40"
                            className="me-2"
                            alt="EventOrganizer Logo"
                        />
                        <span className="fw-bold">EventOrganizer</span>
                    </div>

                    {/* Middle: Contact Info */}
                    <div className="col-md-4 mb-3 mb-md-0 text-center">
                        <p className="mb-1">
                            <i className="fas fa-envelope me-2"></i>
                            info@eventorganizer.com
                        </p>
                        <p className="mb-0">
                            <i className="fas fa-phone me-2"></i>
                            +91 96329 26489
                        </p>
                    </div>

                    {/* Right Side: Social Media */}
                    <div className="col-md-4 text-md-end text-center">
                        <a href="#" className="text-light me-3">
                            <i className="fab fa-facebook fa-lg"></i>
                        </a>
                        <a href="#" className="text-light me-3">
                            <i className="fab fa-twitter fa-lg"></i>
                        </a>
                        <a href="#" className="text-light me-3">
                            <i className="fab fa-instagram fa-lg"></i>
                        </a>
                        <a href="#" className="text-light">
                            <i className="fab fa-linkedin fa-lg"></i>
                        </a>
                    </div>

                </div>

                {/* Optional: Copyright */}
                <div className="text-center mt-3 text-muted small">
                    &copy; {new Date().getFullYear()} EventOrganizer. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

/* -------------------- HOME PAGE -------------------- */
export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Services />
            <Gallery />
            <Footer />
        </>
    );
}
