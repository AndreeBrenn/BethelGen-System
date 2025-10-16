const {
  Inventory_Category,
  Inventory_Subcategory,
  Inventory_Item,
  Inventory_Stocks,
} = require("../models");

//#region CATEGORY
const create_category = async (req, res, next) => {
  const inventoryData = req.body;
  try {
    const result = await Inventory_Category.create(inventoryData);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET CATEGORY ON PAGE
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

// GET CATEGORY IN DROPDOWN
const get_all_category = async (req, res, next) => {
  try {
    const category = await Inventory_Category.findAll({
      include: [
        {
          model: Inventory_Subcategory,
          as: "inv_subcat",
        },
      ],
    });

    return res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const update_category = async (req, res, next) => {
  const categoryData = req.body;
  try {
    const result = await Inventory_Category.update(
      { Category_name: categoryData.Category_name },
      { where: { ID: categoryData.ID } }
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const delete_category = async (req, res, next) => {
  const { ID } = req.params;

  try {
    const result = await Inventory_Category.destroy({ where: { ID } });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//#endregion
//#region SUBCATEGORY
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

const update_subcategory = async (req, res, next) => {
  const subcategoryData = req.body;

  try {
    const result = await Inventory_Subcategory.update(
      {
        Subcategory_name: subcategoryData.Subcategory_name,
        Classification: subcategoryData.Classification,
      },
      { where: { ID: subcategoryData.ID } }
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const delete_subcategory = async (req, res, next) => {
  const { ID } = req.params;

  try {
    const result = await Inventory_Subcategory.destroy({ where: { ID } });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//#endregion

//#region INVENTORY ITEM / INVENTORY STOCKS
const create_Inventory_item = async (req, res, next) => {
  const inventoryData = req.body;

  console.log(inventoryData);

  try {
    const itemResult = await Inventory_Item.create({
      Item_name: inventoryData.item_name,
      Item_category: inventoryData.item_category,
      Item_subcategory: inventoryData.item_subcategory,
      Item_classification: inventoryData.item_classification,
    });

    const serialsWithItemId = inventoryData.serials.map((serial) => ({
      ...serial,
      Item_ID: itemResult.ID, // Adjust field name to match your foreign key
    }));
    const stockResult = await Inventory_Stocks.bulkCreate(serialsWithItemId, {
      validate: true,
    });

    return res.status(200).json([itemResult, stockResult]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create_category,
  get_category,
  create_subcategory,
  create_classification,
  update_category,
  update_subcategory,
  delete_category,
  delete_subcategory,
  create_Inventory_item,
  get_all_category,
};
