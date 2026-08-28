import api from "./api";

export const reviewService = {
  getByVenue: (venueId) => api.get(`/reviews/venue/${venueId}`),
  reply: (reviewId, replyText) => api.post(`/reviews/${reviewId}/reply`, { reply_text: replyText })
};