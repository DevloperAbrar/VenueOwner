module.exports = (sequelize, DataTypes) => {
    const Slot = sequelize.define("Slot", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      venue_id: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      start_time: { type: DataTypes.TIME, allowNull: false },
      end_time: { type: DataTypes.TIME, allowNull: false },
      base_price: DataTypes.DECIMAL(10, 2),
      weekend_price: DataTypes.DECIMAL(10, 2),
      days_of_operation: {
        type: DataTypes.JSONB,
        defaultValue: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
      },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, {
      tableName: "slots",
      indexes: [{ fields: ["venue_id"] }]
    });
  
    return Slot;
  };