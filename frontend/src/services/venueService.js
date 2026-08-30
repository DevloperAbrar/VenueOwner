import api from "./api";

export const venueService = {
  create: (payload) => api.post("/venues", payload),
  getMyVenues: () => api.get("/venues/my"),
  getById: (id) => api.get(`/venues/${id}`),
  update: (id, payload) => api.patch(`/venues/${id}`, payload),
  // Don't set Content-Type manually here — axios/the browser needs to compute
  // it itself so it can append the multipart boundary. Setting it explicitly
  // (as this used to do) strips the boundary and multer can't parse req.file.
  uploadHeroImage: (id, formData) => api.post(`/venues/${id}/hero-image`, formData),
  addGalleryImages: (id, formData) => api.post(`/venues/${id}/gallery`, formData),
  getPublicBySubdomain: (subdomain) => api.get(`/venues/public/${subdomain}`),

  deleteGalleryImage: (id, imageId) => api.delete(`/venues/${id}/gallery/${imageId}`),

  // Super Admin
  listAll: (params) => api.get("/venues", { params }),
  toggleActive: (id, is_active) => api.patch(`/venues/${id}/status`, { is_active }),
  remove: (id) => api.delete(`/venues/${id}`)
};
