import api from "./api";

export const marketplaceProfileService = {
  get: (venueId) => api.get(`/venues/${venueId}/marketplace-profile`),
  update: (venueId, payload) => api.put(`/venues/${venueId}/marketplace-profile`, payload),
  updateServiceAreas: (venueId, cityIds) =>
    api.put(`/venues/${venueId}/marketplace-profile/service-areas`, { city_ids: cityIds }),
  getCompletion: (venueId) => api.get(`/venues/${venueId}/marketplace-profile/completion`)
};