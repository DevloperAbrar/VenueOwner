module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define("Client", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      venue_id: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      email: DataTypes.STRING,
      total_business_value: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      pending_balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      notes: DataTypes.TEXT,
      documents: { type: DataTypes.JSONB, defaultValue: [] },
      source: {
        type: DataTypes.ENUM("inquiry", "booking", "manual"),
        defaultValue: "manual"
      }
    }, {
      tableName: "clients",
      indexes: [
        { fields: ["venue_id"] },
        { fields: ["phone"] }
      ]
    });
  
    return Client;
  };