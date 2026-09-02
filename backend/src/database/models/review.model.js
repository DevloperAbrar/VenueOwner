module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    venue_id: DataTypes.UUID,
    vendor_listing_id: DataTypes.INTEGER,
    reviewer_name: { type: DataTypes.STRING, allowNull: false },
    reviewer_phone_hash: DataTypes.STRING,
    reviewer_email_hash: DataTypes.STRING,
    event_type: DataTypes.STRING,
    event_date: DataTypes.DATEONLY,
    star_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    review_text: DataTypes.TEXT,
    source: { type: DataTypes.STRING, allowNull: false }, // booking_auto / marketplace_manual
    booking_id: DataTypes.UUID,
    status: { type: DataTypes.STRING, defaultValue: "pending" }, // pending / approved / rejected
    owner_reply: DataTypes.TEXT,
    owner_reply_at: DataTypes.DATE
  }, {
    tableName: "reviews"
  });

  return Review;
};