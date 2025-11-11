module.exports = (sequelize, DataTypes) => {
  const Dynamic_Signatories = sequelize.define("Dynamic_Signatories", {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    User_ID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Name: { type: DataTypes.STRING, allowNull: false },
    Role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Dynamic_Signatories;
};
