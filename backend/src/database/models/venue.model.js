module.exports = (sequelize, DataTypes) => {
    const Venue = sequelize.define("Venue", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      hall_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subdomain: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      owner_name: DataTypes.STRING,
      phone: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.TEXT,
      google_maps_link: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
      venue_type: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  
      // Website builder fields
      template_id: { type: DataTypes.STRING, defaultValue: "template-1" },
      theme_color: { type: DataTypes.STRING, defaultValue: "#7c3aed" },
      hero_image_url: DataTypes.STRING,
      hero_heading: DataTypes.STRING,
      hero_subheading: DataTypes.STRING,
      hero_button_text: { type: DataTypes.STRING, defaultValue: "Enquire Now" },
      about_text: DataTypes.TEXT,
      about_highlights: { type: DataTypes.JSONB, defaultValue: [] },
      services: { type: DataTypes.JSONB, defaultValue: [] },
      gallery: { type: DataTypes.JSONB, defaultValue: [] },
      testimonials: { type: DataTypes.JSONB, defaultValue: [] },
      show_pricing_section: { type: DataTypes.BOOLEAN, defaultValue: true },
  
      // Payment/GST settings
      upi_id: DataTypes.STRING,
      bank_details: DataTypes.JSONB,
      gst_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
      gst_number: DataTypes.STRING,
  
      is_live: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      setup_completed_steps: { type: DataTypes.JSONB, defaultValue: [] },
  
      last_login_at: DataTypes.DATE
    }, {
      tableName: "venues",
      indexes: [
        { fields: ["subdomain"] },
        { fields: ["owner_id"] },
        { fields: ["city"] }
      ]
    });
  
    return Venue;
  };