function EventCard({ event }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img src={event.image} className="card-img-top" alt={event.title} />
        <div className="card-body">
          <h5 className="card-title">{event.title}</h5>
          <p className="card-text">{event.description}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Price:</strong> ₹{event.price}</p>
          <p><strong>Status:</strong> {event.status}</p>
          <button className="btn btn-success w-100">BUY</button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
