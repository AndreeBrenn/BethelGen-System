module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      LastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Branch: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Role: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Access: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      Position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      deletedAt: "destroyTime",
    }
  );

  Users.associate = (models) => {
    Users.hasMany(models.Inventory_Request, {
      foreignKey: "USER_ID",
      as: "Item_userID",
    });
  };

  return Users;
};
