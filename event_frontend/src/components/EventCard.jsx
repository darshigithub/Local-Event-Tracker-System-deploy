function EventCard({ event }) {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div
        className="card border-0 shadow-sm rounded-4 h-100"
        style={{
          overflow: "hidden",
          transition: "all 0.3s ease",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        {/* IMAGE */}
        <div style={{ position: "relative" }}>
          <img
            src={event.image || "https://via.placeholder.com/400x250"}
            alt={event.title}
            className="card-img-top"
            style={{
              height: "200px",
              objectFit: "cover"
            }}
          />

          {/* STATUS BADGE */}
          <span
            className={`badge position-absolute top-0 end-0 m-2 px-3 py-2 ${
              event.status === "OPEN" ? "bg-success" : "bg-danger"
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* BODY */}
        <div className="card-body d-flex flex-column">

          {/* TITLE */}
          <h5 className="fw-bold text-dark mb-2">
            {event.title}
          </h5>

          {/* DESCRIPTION */}
          <p
            className="text-muted small mb-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {event.description}
          </p>

          {/* DETAILS */}
          <small className="text-muted d-block">
            📅 {event.date}
          </small>

          <small className="text-muted d-block mb-2">
            📍 {event.location}
          </small>

          {/* FOOTER */}
          <div className="mt-auto d-flex justify-content-between align-items-center">

            {/* PRICE */}
            <span className="fw-bold text-primary fs-5">
              {event.price > 0 ? `₹${event.price}` : "Free"}
            </span>

            {/* BUTTON */}
            <button className="btn btn-sm btn-primary rounded-pill px-3">
              Buy Ticket
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EventCard;