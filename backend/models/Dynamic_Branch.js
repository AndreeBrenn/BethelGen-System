module.exports = (sequelize, DataTypes) => {
  const Dynamic_Branch = sequelize.define("Dynamic_Branch", {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Dynamic_Branch;
};
