module.exports = (sequelize, DataTypes) => {
  const Dynamic_Documents = sequelize.define("Dynamic_Document", {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Schema: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    File_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Dynamic_Documents;
};
