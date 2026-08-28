import React, { useEffect, useState } from "react";
import { Star, Send } from "lucide-react";
import reviewApi from "../../services/reviewApi";
import dayjs from "dayjs";

export default function ReviewsSection({ venueId }) {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    reviewApi.get(`/venue/${venueId}`).then(({ data }) => setData(data.data));
  };

  useEffect(() => { load(); }, [venueId]);

  if (!data) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800">
          Reviews {data.review_count > 0 && `(${data.review_count})`}
        </h2>
        <button onClick={() => setShowForm(true)} className="text-sm text-primary-600 hover:underline">
          Write a review
        </button>
      </div>

      {data.average_rating && (
        <div className="flex items-center gap-2 mb-4">
          <Star size={18} className="fill-amber-400 text-amber-400" />
          <span className="text-lg font-semibold text-gray-800">{data.average_rating}</span>
          <span className="text-sm text-gray-400">out of 5</span>
        </div>
      )}

      {data.response_rate_badge && (
        <p className="text-xs text-green-600 mb-4">{data.response_rate_badge}</p>
      )}

      <div className="space-y-4">
        {data.reviews.length === 0 && (
          <p className="text-sm text-gray-400">No reviews yet — be the first to review this vendor.</p>
        )}
        {data.reviews.map((r) => (
          <div key={r.id} className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-800 text-sm">{r.reviewer_name}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={13} className={i < r.star_rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-1">
              {r.event_type} {r.event_date && `· ${dayjs(r.event_date).format("MMM YYYY")}`}
            </p>
            <p className="text-sm text-gray-600">{r.review_text}</p>
            {r.owner_reply && (
              <div className="mt-2 bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <p className="font-medium text-gray-700 text-xs mb-1">Owner's reply</p>
                {r.owner_reply}
              </div>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <ReviewFormModal venueId={venueId} onClose={() => setShowForm(false)} onSubmitted={load} />
      )}
    </div>
  );
}

function ReviewFormModal({ venueId, onClose, onSubmitted }) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ reviewer_name: "", phone: "", event_type: "", event_date: "", star_rating: 5, review_text: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const wordCount = form.review_text.trim().split(/\s+/).filter(Boolean).length;

  const requestOtp = async () => {
    setError("");
    if (wordCount < 30) { setError("Review must be at least 30 words"); return; }
    if (!form.reviewer_name || !form.phone) { setError("Name and phone are required"); return; }
    setLoading(true);
    try {
      await reviewApi.post("/request-otp", { phone: form.phone });
      setStep("otp");
    } catch {
      setError("Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await reviewApi.post("/verify-otp", { phone: form.phone, otp });
      await reviewApi.post("/submit", {
        venue_id: venueId,
        ...form,
        phone_verification_token: data.data.token
      });
      setStep("done");
      onSubmitted();
    } catch {
      setError("Invalid OTP or something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        {step === "form" && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Write a Review</h3>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Your name"
              value={form.reviewer_name} onChange={(e) => setForm({ ...form, reviewer_name: e.target.value })} />
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Phone number"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Event type"
              value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} />
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button key={i} onClick={() => setForm({ ...form, star_rating: i + 1 })}>
                  <Star size={22} className={i < form.star_rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                </button>
              ))}
            </div>
            <div>
              <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Write your review (minimum 30 words)"
                value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} />
              <p className={`text-xs mt-1 ${wordCount >= 30 ? "text-green-600" : "text-gray-400"}`}>{wordCount} / 30 words</p>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button disabled={loading} onClick={requestOtp} className="w-full bg-primary-600 text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
              <Send size={14} /> {loading ? "Sending OTP..." : "Verify Phone & Continue"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Enter OTP sent to {form.phone}</h3>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center tracking-widest"
              maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button disabled={loading} onClick={verifyAndSubmit} className="w-full bg-primary-600 text-white text-sm py-2 rounded-lg disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-6">
            <p className="font-semibold text-gray-800">Thanks for your review!</p>
            <p className="text-sm text-gray-500 mt-1">It's pending approval and will appear here once approved.</p>
            <button onClick={onClose} className="mt-4 text-primary-600 text-sm">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}