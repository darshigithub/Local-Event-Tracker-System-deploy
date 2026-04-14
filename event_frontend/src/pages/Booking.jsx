import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import inventoryApi from "../inventoryApi"; 

function BookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventoryQty, setInventoryQty] = useState(0);

  const [seats, setSeats] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); 

  // ---------------- Fetch Data ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await api.get(`/events/${eventId}`);
        setEvent(eventRes.data);

        const inventoryRes = await inventoryApi.get();
        setInventory(inventoryRes.data); 

      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // ---------------- Booking ----------------
  const handleBooking = async () => {
    setError("");

    if (seats < 1) {
      setError("Select at least 1 seat");
      return;
    }

    if (seats > event.availableSeats) {
      setError("Not enough seats available");
      return;
    }

    if (selectedItem && inventoryQty > selectedItem.availableQuantity) {
      setError("Not enough inventory available");
      return;
    }

    try {
      const res = await api.post("/bookings", {
        eventId: event.id,
        seats: seats,
        inventoryItemId: selectedItem?.id || null,
        inventoryQuantity: inventoryQty || 0,
      });

      navigate("/payment", {
        state: {
          bookingId: res.data.bookingId,
          eventTitle: event.title,
          seats,
          inventoryItem: selectedItem?.name,
          inventoryQty,
          totalPrice: totalPrice,
        },
      });

    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!event) return <p className="text-center mt-5 text-danger">Event not found</p>;

  const totalPrice =
    seats * event.price +
    (selectedItem ? inventoryQty * 0 : 0); // No price in inventory yet

  return (
    <>
      <Navbar />

      <div className="container my-5 d-flex justify-content-center">
        <div className="card shadow-lg p-4" style={{ width: "500px" }}>

          <h3 className="text-center text-primary mb-4">
            {event.title}
          </h3>

          {/* EVENT DETAILS */}
          <div className="mb-2"><b>Date:</b> {event.eventDate}</div>
          <div className="mb-2">
            <b>Time:</b> {event.startTime} - {event.endTime}
          </div>
          <div className="mb-2"><b>Location:</b> {event.location}</div>
          <div className="mb-2">
            <b>Price per Seat:</b> ₹{event.price}
          </div>
          <div className="mb-3">
            <b>Available Seats:</b> {event.availableSeats}
          </div>

          {/* SEAT SELECTOR */}
          <div className="d-flex justify-content-between align-items-center my-3">
            <button
              className="btn btn-danger"
              onClick={() => seats > 1 && setSeats(seats - 1)}
            >-</button>

            <span className="fw-bold">{seats}</span>

            <button
              className="btn btn-success"
              onClick={() =>
                seats < event.availableSeats && setSeats(seats + 1)
              }
            >+</button>
          </div>

          {/* INVENTORY DROPDOWN */}
          <div className="mt-3">
            <label><b>Select Inventory</b></label>

            <select
              className="form-control mt-2"
              onChange={(e) => {
                const item = inventory.find(
                  (i) => i.id === parseInt(e.target.value)
                );
                setSelectedItem(item);
                setInventoryQty(0);
              }}
            >
              <option value="">-- Select Item --</option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Stock: {item.availableQuantity})
                </option>
              ))}
            </select>
          </div>

          {/* INVENTORY QUANTITY */}
          {selectedItem && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-danger"
                onClick={() =>
                  inventoryQty > 0 && setInventoryQty(inventoryQty - 1)
                }
              >-</button>

              <span>{inventoryQty}</span>

              <button
                className="btn btn-success"
                onClick={() =>
                  inventoryQty < selectedItem.availableQuantity &&
                  setInventoryQty(inventoryQty + 1)
                }
              >+</button>
            </div>
          )}

          {/* TOTAL */}
          <div className="mt-4">
            <h5>Total Price: ₹{totalPrice}</h5>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={handleBooking}
          >
            Confirm Booking
          </button>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingPage;