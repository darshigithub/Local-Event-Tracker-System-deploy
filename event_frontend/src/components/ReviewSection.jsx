import { useState, useEffect } from "react";
import { fetchWithAuth } from "../api";

// --------------------------
// Star Rating Component
// --------------------------
function StarRating({ rating, onRatingChange, readonly = false, size = "1.5rem" }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="d-flex align-items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          style={{
            cursor: readonly ? "default" : "pointer",
            fontSize: size,
            color: star <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// --------------------------
// Review Form
// --------------------------
function ReviewForm({ eventId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submitReview = async (e) => {
    e.preventDefault();
    setMsg("");

    if (rating === 0) {
      setMsg("Please select a rating.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/api/reviews/${eventId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit review");
      }

      setRating(0);
      setComment("");
      setMsg("Review submitted successfully!");
      onReviewSubmitted();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5>Write a Review</h5>
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={submitReview}>
          <StarRating rating={rating} onRatingChange={setRating} size="2rem" />
          <textarea
            className="form-control mt-3"
            rows="3"
            placeholder="Your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="btn btn-primary mt-3" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --------------------------
// Review Card
// --------------------------
function ReviewCard({ review }) {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <strong>{review.reviewerName || "Anonymous"}</strong>
        <StarRating rating={review.rating} readonly size="1.2rem" />
        {review.comment && <p className="mt-2">{review.comment}</p>}
      </div>
    </div>
  );
}

// --------------------------
// MAIN REVIEW SECTION
// --------------------------
export default function ReviewSection({ eventId, hostName }) {
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  // --------------------------
  // Load Reviews (PUBLIC)
  // --------------------------
  const loadReviews = async () => {
    const res = await fetch(`http://localhost:8080/api/reviews/${eventId}`);
    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    }
  };

  // --------------------------
  // Check Review Eligibility
  // --------------------------
  const checkCanReview = async () => {
    setCanReview(false);

    const userId = localStorage.getItem("user_id");
    const email = localStorage.getItem("email");

    console.log("Auth info:", email, userId);

    if (!email || !userId) {
      setReason("Please login to write a review.");
      return;
    }

    if (email === hostName) {
      setReason("Host cannot review their own event.");
      return;
    }

    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/api/reviews/can-review/${eventId}/${userId}`
      );

      if (!res.ok) {
        setReason("You are not eligible to review this event.");
        return;
      }

      const data = await res.json();
      setCanReview(data.canReview);
      setReason(data.reason);
    } catch {
      setReason("Error checking review eligibility.");
    }
  };

  // 🔥 IMPORTANT FIX
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadReviews();
      await checkCanReview();
      setLoading(false);
    };
    init();
  }, [eventId, localStorage.getItem("user_id")]);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="mt-4">
      <h4>Reviews</h4>

      {reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}

      {canReview ? (
        <ReviewForm eventId={eventId} onReviewSubmitted={loadReviews} />
      ) : (
        reason && <div className="alert alert-info mt-3">{reason}</div>
      )}
    </div>
  );
}
