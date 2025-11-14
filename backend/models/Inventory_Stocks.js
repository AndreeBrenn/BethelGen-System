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
    Item_document_category: {
      type: Datatypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  });

  Inventory_Stocks.associate = (models) => {
    Inventory_Stocks.belongsTo(models.Inventory_Item, {
      foreignKey: "Item_ID",
      targetKey: "ID",
      as: "inv_stocks",
    });

    Inventory_Stocks.belongsTo(models.Inventory_Request, {
      foreignKey: "Inv_requestID",
      targetKey: "ID",
      as: "Inv_request",
    });
  };

  return Inventory_Stocks;
};
