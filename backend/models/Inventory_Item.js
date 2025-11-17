module.exports = (sequelize, DataTypes) => {
  const Inventory_Item = sequelize.define("Inventory_Item", {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Item_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Item_subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Item_classification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Item_origin_branch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    policy_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Inventory_Item.associate = (models) => {
    Inventory_Item.hasMany(models.Inventory_Stocks, {
      foreignKey: { name: "Item_ID" },
      as: "inv_stocks",
      onDelete: "cascade",
    });
  };

  return Inventory_Item;
};
