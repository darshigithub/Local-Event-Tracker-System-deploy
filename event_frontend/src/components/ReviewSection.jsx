import { useState, useEffect } from "react";
import api from "../api"; 

function StarRating({ rating, onRatingChange, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            cursor: readonly ? "default" : "pointer",
            fontSize: "1.8rem",
            color: star <= (hover || rating) ? "#ffc107" : "#e4e5e9",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}


function ReviewForm({ eventId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setMsg("Please select rating");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      await api.post(
        "/reviews",
        {
          eventId,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setMsg("Review added successfully");
      setRating(0);
      setComment("");
      onSuccess();
    } catch (err) {
      setMsg(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5>Add Review</h5>

        {msg && <div className="alert alert-info">{msg}</div>}

        <form onSubmit={submitReview}>
          <StarRating rating={rating} onRatingChange={setRating} />

          <textarea
            className="form-control mt-3"
            placeholder="Write your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button className="btn btn-primary mt-3" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h6>{review.reviewerName}</h6>

        <StarRating rating={review.rating} readonly />

        {review.comment && (
          <p className="mt-2 text-muted">{review.comment}</p>
        )}

        <small className="text-secondary">
          {new Date(review.reviewedAt).toLocaleString()}
        </small>
      </div>
    </div>
  );
}

export default function ReviewSection({ eventId }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem("access_token");

  const loadReviews = async () => {
    try {
      const res = await api.get(`/reviews/event/${eventId}`);
      setReviews(res.data);
    } catch {
      setReviews([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadReviews();
      setLoading(false);
    };
    init();
  }, [eventId]);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="mt-4">
      {/* <h4>⭐ Reviews</h4> */}

      {!isLoggedIn && (
        <div className="alert alert-warning">
          Please login to add a review
        </div>
      )}

      {isLoggedIn && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "Add Review"}
        </button>
      )}

      {showForm && isLoggedIn && (
        <ReviewForm
          eventId={eventId}
          onSuccess={() => {
            loadReviews();
            setShowForm(false);
          }}
        />
      )}

      {reviews.length === 0 ? (
        <p className="text-muted">No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <ReviewCard key={r.reviewId} review={r} />
        ))
      )}
    </div>
  );
}