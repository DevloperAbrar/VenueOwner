import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import Loader from "../../../components/common/Loader";
import Card from "../../../components/common/Card";
import { reviewService } from "../../../services/reviewService";
import { showSuccess, showError } from "../../../components/common/Toast";
import { Star } from "lucide-react";
import dayjs from "dayjs";

export default function OwnerReviews() {
  const { venue, loading: venueLoading } = useVenue();
  const { data, loading, refetch } = useFetch(venue ? `/reviews/venue/${venue.id}` : null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [submitting, setSubmitting] = useState(null);

  if (venueLoading || loading) {
    return (
      <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Reviews">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  const submitReply = async (reviewId) => {
    const text = replyDrafts[reviewId];
    if (!text) return;
    setSubmitting(reviewId);
    try {
      await reviewService.reply(reviewId, text);
      showSuccess("Reply posted");
      await refetch();
    } catch (err) {
      showError(err.response?.data?.message || "Could not post reply");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Reviews">
      {data?.average_rating && (
        <div className="flex items-center gap-2 mb-6">
          <Star size={22} className="fill-amber-400 text-amber-400" />
          <span className="text-2xl font-bold text-gray-800">{data.average_rating}</span>
          <span className="text-sm text-gray-400">from {data.review_count} reviews</span>
        </div>
      )}

      {(!data?.reviews || data.reviews.length === 0) ? (
        <p className="text-sm text-gray-400">No approved reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {data.reviews.map((r) => (
            <Card key={r.id}>
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-800">{r.reviewer_name}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={13} className={i < r.star_rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                {r.event_type} {r.event_date && `· ${dayjs(r.event_date).format("MMM D, YYYY")}`}
              </p>
              <p className="text-sm text-gray-600 mb-3">{r.review_text}</p>

              {r.owner_reply ? (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                  <p className="font-medium text-gray-700 text-xs mb-1">Your reply</p>
                  {r.owner_reply}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Reply to this review..."
                    value={replyDrafts[r.id] || ""}
                    onChange={(e) => setReplyDrafts({ ...replyDrafts, [r.id]: e.target.value })}
                  />
                  <button
                    disabled={submitting === r.id}
                    onClick={() => submitReply(r.id)}
                    className="bg-primary-600 text-white text-sm px-4 rounded-lg disabled:opacity-50"
                  >
                    Reply
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}