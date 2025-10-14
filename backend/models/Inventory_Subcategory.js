module.exports = (sequelize, DataTypes) => {
  const Inventory_Subcategory = sequelize.define("Inventory_Subcategory", {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Subcategory_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Classification: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  });

  Inventory_Subcategory.associate = (models) => {
    Inventory_Subcategory.belongsTo(models.Inventory_Category, {
      foreignKey: "Inv_SubCat_ID",
      targetKey: "ID",
      as: "inv_subcat",
      onDelete: "cascade",
    });
  };

  return Inventory_Subcategory;
};
