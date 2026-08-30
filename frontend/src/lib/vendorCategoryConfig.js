export const VENDOR_CATEGORIES = [
    { slug: "marriage-hall", label: "Marriage Hall", group: "venue" },
    { slug: "banquet-hall", label: "Banquet Hall", group: "venue" },
    { slug: "party-lawn", label: "Party Lawn", group: "venue" },
    { slug: "farmhouse", label: "Farmhouse", group: "venue" },
    { slug: "photographer", label: "Photographer", group: "service" },
    { slug: "videographer", label: "Videographer", group: "service" },
    { slug: "decorator", label: "Decorator", group: "service" },
    { slug: "caterer", label: "Caterer", group: "service" },
    { slug: "dj", label: "DJ", group: "service" },
    { slug: "makeup-artist", label: "Makeup Artist", group: "service" },
    { slug: "mehendi-artist", label: "Mehendi Artist", group: "service" },
    { slug: "tent-house", label: "Tent House", group: "service" },
    { slug: "sound-lighting", label: "Sound & Lighting", group: "service" },
    { slug: "card-printing", label: "Card Printing", group: "service" },
    { slug: "horse-buggy", label: "Horse & Buggy", group: "service" },
    { slug: "pandit-services", label: "Pandit Services", group: "service" },
    { slug: "travel-transport", label: "Travel & Transport", group: "service" },
    { slug: "event-manager", label: "Event Manager", group: "service" }
  ];
  
  export const CATEGORY_FIELD_CONFIG = {
    venue: {
      label: "Venue details",
      fields: [
        { name: "hall_name", label: "Venue Name", type: "text", required: true },
        { name: "address", label: "Full Address", type: "text", required: true },
        { name: "capacity", label: "Guest Capacity", type: "number", required: true },
        { name: "google_maps_link", label: "Google Maps Link", type: "text", required: false }
      ]
    },
    service: {
      label: "Business details",
      fields: [
        { name: "hall_name", label: "Business Name", type: "text", required: true },
        { name: "primary_locality", label: "Service Area / Locality", type: "text", required: true },
        { name: "team_size", label: "Team Size", type: "number", required: false },
        { name: "starting_price", label: "Starting Price (₹)", type: "number", required: false }
      ]
    }
  };
  
  export const COMMON_FIELDS = [
    { name: "owner_name", label: "Owner Name", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true }
  ];
  
  export function getCategoryGroup(categorySlug) {
    const category = VENDOR_CATEGORIES.find((c) => c.slug === categorySlug);
    return category ? category.group : "service";
  }
  
  // A vendor can run multiple lines of business (e.g. Marriage Hall + Caterer).
  // If ANY selected category is a physical "venue" (has an address/capacity),
  // we show the venue field set — a person with a hall AND a catering service
  // still needs to fill in the venue's address and capacity.
  export function getGroupForCategories(selectedSlugs) {
    if (!selectedSlugs || selectedSlugs.length === 0) return "service";
    const hasVenueGroup = selectedSlugs.some((slug) => getCategoryGroup(slug) === "venue");
    return hasVenueGroup ? "venue" : "service";
  }
  
  // business_category (singular) drives the dashboard/public-page template,
  // so we need one "primary" pick even when multiple are selected.
  // Preference: the first physical venue-type category selected (since that
  // decides layout most strongly), else just the first one selected.
  export function getPrimaryCategory(selectedSlugs) {
    if (!selectedSlugs || selectedSlugs.length === 0) return null;
    const venueSlug = selectedSlugs.find((slug) => getCategoryGroup(slug) === "venue");
    return venueSlug || selectedSlugs[0];
  }