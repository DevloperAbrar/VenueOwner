export const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || "venuesafar.com";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const BACKEND_URL = API_BASE_URL.replace("/api", ""); // e.g. http://localhost:5000

// hero_image_url / gallery paths come back from the API as relative paths
// (e.g. "/uploads/venues/xxx.png") because they're served by the backend,
// not this frontend. Prefix them so <img> requests hit the right origin.
export function getImageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  return `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export const CATEGORY_SLUGS = [
  "marriage-hall", "banquet-hall", "party-lawn", "farmhouse",
  "photographer", "videographer", "decorator", "caterer", "dj",
  "makeup-artist", "mehendi-artist", "tent-house", "sound-lighting",
  "card-printing", "horse-buggy", "pandit-services",
  "travel-transport", "event-manager"
];

export const SORT_OPTIONS = [
  { value: "relevant", label: "Most Relevant" },
  { value: "highest_rated", label: "Highest Rated" },
  { value: "price_low", label: "Price Low to High" },
  { value: "price_high", label: "Price High to Low" },
  { value: "newest", label: "Newest" }
];