export const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || "venuesafar.com";

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