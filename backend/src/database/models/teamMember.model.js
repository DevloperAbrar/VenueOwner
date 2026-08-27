module.exports = (sequelize, DataTypes) => {
    const TeamMember = sequelize.define("TeamMember", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      venue_id: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      permissions: {
        type: DataTypes.JSONB,
        defaultValue: { bookings: true, payments: true, website: false, billingSettings: false }
      },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, {
      tableName: "team_members",
      indexes: [{ fields: ["venue_id"] }]
    });
  
    return TeamMember;
  };