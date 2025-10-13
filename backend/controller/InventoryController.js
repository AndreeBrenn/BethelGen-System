const { Inventory_Category, Inventory_Subcategory } = require("../models");

const create_category = async (req, res, next) => {
  const inventoryData = req.body;
  try {
    const result = await Inventory_Category.create(inventoryData);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const get_category = async (req, res, next) => {
  const { search, limit, offset } = req.query;

  try {
    const result = await Users.findAndCountAll({
      where: {
        ...(search && {
          Category_name: { [Op.iLike]: `%${search}%` },
        }),
      },
      include: [
        {
          model: Inventory_Subcategory,
          as: "Inventory_Subcategory",
        },
      ],
      limit,
      offset,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { create_category, get_category };
