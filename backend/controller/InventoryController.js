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
    const result = await Inventory_Category.findAndCountAll({
      where: {
        ...(search && {
          Category_name: { [Op.iLike]: `%${search}%` },
        }),
      },
      include: [
        {
          model: Inventory_Subcategory,
          as: "inv_subcat",
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

const create_subcategory = async (req, res, next) => {
  const subcategoryData = req.body;
  try {
    const result = await Inventory_Subcategory.create(subcategoryData);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create_classification = async (req, res, next) => {
  const classificationData = req.body;

  try {
    const result = await Inventory_Subcategory.update(
      { Classification: classificationData.Classification },
      { where: { ID: classificationData.sub_categoryID } }
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create_category,
  get_category,
  create_subcategory,
  create_classification,
};
