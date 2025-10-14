module.exports = (sequelize, DataTypes) => {
  const Inventory_Category = sequelize.define("Inventory_Category", {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Inventory_Category.associate = (models) => {
    Inventory_Category.hasMany(models.Inventory_Subcategory, {
      foreignKey: { name: "Inv_SubCat_ID" },
      onDelete: "cascade",
      as: "inv_subcat",
    });
  };

  return Inventory_Category;
};
