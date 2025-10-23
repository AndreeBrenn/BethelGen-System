module.exports = (sequelize, DataTypes) => {
  const Inventory_Request = sequelize.define("Inventory_Request", {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Item_classification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Item_subcategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Item_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Item_description: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    Item_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Item_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Item_signatories: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    Item_branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Item_amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  });

  Inventory_Request.associate = (models) => {
    Inventory_Request.belongsTo(models.Users, {
      foreignKey: "USER_ID",
      as: "Item_userID",
    });

    Inventory_Request.hasMany(models.Inventory_Stocks, {
      foreignKey: "Inv_requestID",
      as: "Inv_request",
    });
  };

  return Inventory_Request;
};
