import React from "react";
import { useNavigate } from "react-router-dom";

const events = [
    {
        title: "Music Festival",
        date: "May 12, 2024",
        image:
            "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    },
    {
        title: "Tech Conference",
        date: "June 5, 2024",
        image:
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    },
    {
        title: "Food Carnival",
        date: "July 20, 2024",
        image:
            "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
    },
    {
        title: "Beach Party",
        date: "August 15, 2024",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
];

export default function EventDashboard() {

    const navigate = useNavigate(); // 👈 add this

    return (
        <div className="bg-light min-vh-100 d-flex flex-column">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    <a className="navbar-brand fw-bold text-primary" href="/">
                        EventSphere
                    </a>

                    <div className="collapse navbar-collapse justify-content-end">
                        <ul className="navbar-nav align-items-center gap-3">
                            <li className="nav-item">
                                <a className="nav-link" href="/#gallery">Gallery</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/#services">Services</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link fw-semibold" href="">
                                    Login · Sign Up
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Create Event Button */}
            <div className="text-center my-4">
                <button
                    className="btn btn-primary btn-lg px-5"
                    onClick={() => navigate("/create-event")}  // 👈 navigation
                >
                    Create an Event
                </button>
            </div>

            {/* Upcoming Events */}
            <div className="container mb-5">
                <h5 className="fw-bold mb-4">Upcoming Events</h5>

                <div className="row g-4">
                    {events.map((event, index) => (
                        <div className="col-md-6 col-lg-3" key={index}>
                            <div className="card h-100 shadow-sm border-0">
                                <img
                                    src={event.image}
                                    className="card-img-top"
                                    alt={event.title}
                                    style={{ height: "160px", objectFit: "cover" }}
                                />

                                <div className="card-body">
                                    <h6 className="fw-bold">{event.title}</h6>
                                    <p className="text-muted mb-3">{event.date}</p>
                                    <button className="btn btn-primary w-100">
                                        BUY
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white mt-auto py-3 border-top">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3 text-primary fs-5">
                        <i className="bi bi-facebook"></i>
                        <i className="bi bi-twitter"></i>
                        <i className="bi bi-instagram"></i>
                        <i className="bi bi-youtube"></i>
                    </div>

                    <div className="fw-semibold text-primary">
                        EventSphere
                    </div>
                </div>
            </footer>
        </div>
    );
}
