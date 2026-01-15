import { useState, useEffect } from "react";
import { fetchWithAuth } from "../api";

// Star Rating Component
function StarRating({ rating, onRatingChange, readonly = false, size = "1.5rem" }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="d-flex align-items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          style={{
            cursor: readonly ? "default" : "pointer",
            fontSize: size,
            color: star <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9",
            transition: "color 0.2s ease"
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Review Form Component
function ReviewForm({ eventId, userId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);

    try {
      const { ok, data } = await fetchWithAuth(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          body: JSON.stringify({
            user_id: userId,
            event_id: eventId,
            rating: rating,
            review_text: reviewText
          })
        }
      );

      if (ok) {
        setSuccess("Review submitted successfully!");
        setRating(0);
        setReviewText("");
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        setError(data.error || "Failed to submit review");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Write a Review</h5>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Your Rating</label>
            <StarRating rating={rating} onRatingChange={setRating} size="2rem" />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Your Review (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || rating === 0}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Single Review Card Component
function ReviewCard({ review }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          {review.user_profile_pic ? (
            <img
              src={review.user_profile_pic}
              alt={review.user_name}
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-2"
              style={{ width: "40px", height: "40px" }}
            >
              <span className="text-white fw-bold">
                {review.user_name ? review.user_name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          )}
          <div>
            <h6 className="mb-0">{review.user_name || "Anonymous"}</h6>
            <small className="text-muted">
              {new Date(review.review_date).toLocaleDateString()}
            </small>
          </div>
        </div>
        
        <StarRating rating={review.rating} readonly size="1.2rem" />
        
        {review.review_text && (
          <p className="mt-2 mb-0">{review.review_text}</p>
        )}
      </div>
    </div>
  );
}

// Main Review Section Component
function ReviewSection({ eventId, eventStatus }) {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [canReviewReason, setCanReviewReason] = useState("");
  const [loading, setLoading] = useState(true);
  
  const userId = localStorage.getItem("user_id");

  const loadReviews = async () => {
    try {
      const { ok, data } = await fetchWithAuth(
        `http://localhost:5000/api/reviews/event/${eventId}`
      );

      if (ok) {
        setReviews(data.reviews || []);
        setTotalReviews(data.total_reviews || 0);
        setAverageRating(data.average_rating || 0);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  const checkCanReview = async () => {
    if (!userId) {
      setCanReview(false);
      setCanReviewReason("Please login to review.");
      return;
    }

    try {
      const { ok, data } = await fetchWithAuth(
        `http://localhost:5000/api/reviews/can-review/${eventId}/${userId}`
      );

      if (ok) {
        setCanReview(data.can_review);
        setCanReviewReason(data.reason);
      }
    } catch (err) {
      console.error("Failed to check review eligibility:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadReviews(), checkCanReview()]);
      setLoading(false);
    };
    loadData();
  }, [eventId, userId]);

  const handleReviewSubmitted = () => {
    loadReviews();
    checkCanReview();
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="mt-4">
      <h4 className="mb-3">
        Reviews & Ratings
        {totalReviews > 0 && (
          <span className="ms-2 text-muted fs-6">
            ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
          </span>
        )}
      </h4>

      {/* Average Rating Display */}
      {totalReviews > 0 && (
        <div className="d-flex align-items-center mb-4 p-3 bg-light rounded">
          <div className="text-center me-4">
            <h2 className="mb-0">{averageRating}</h2>
            <small className="text-muted">out of 5</small>
          </div>
          <div>
            <StarRating rating={Math.round(averageRating)} readonly size="1.5rem" />
            <small className="text-muted d-block mt-1">
              Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </small>
          </div>
        </div>
      )}

      {/* Review Form - Only show if event is completed and user can review */}
      {eventStatus === "completed" && canReview && (
        <ReviewForm
          eventId={eventId}
          userId={parseInt(userId)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {/* Show reason why user can't review */}
      {eventStatus === "completed" && !canReview && userId && (
        <div className="alert alert-info mb-4">
          <i className="bi bi-info-circle me-2"></i>
          {canReviewReason}
        </div>
      )}

      {/* Show message if event is not completed */}
      {eventStatus !== "completed" && (
        <div className="alert alert-warning mb-4">
          <i className="bi bi-clock me-2"></i>
          Reviews can only be submitted after the event is completed.
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div>
          {reviews.map((review) => (
            <ReviewCard key={review.review_id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted">
          <p>No reviews yet. Be the first to review this event!</p>
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
