module.exports = (sequelize, Datatypes) => {
  const Inventory_Stocks = sequelize.define("Inventory_Stocks", {
    ID: {
      type: Datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Item_serial: {
      type: Datatypes.STRING,
      allowNull: false,
      unique: true,
    },
    Item_status: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    Item_branch: {
      type: Datatypes.STRING,
      allowNull: true,
    },
  });

  Inventory_Stocks.associate = (models) => {
    Inventory_Stocks.belongsTo(models.Inventory_Item, {
      foreignKey: "Item_ID",
      targetKey: "ID",
      as: "inv_stocks",
    });
  };

  return Inventory_Stocks;
};
