const {
  Inventory_Category,
  Inventory_Subcategory,
  Inventory_Item,
  Inventory_Stocks,
  sequelize,
} = require("../models");

//#region CATEGORY

// @desc    Create Category
// @route   POST /inventory/create-category
// @access  Private

const create_category = async (req, res, next) => {
  const inventoryData = req.body;
  try {
    const result = await Inventory_Category.create(inventoryData);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Category with Pagination
// @route   GET /inventory/get-category
// @access  Private

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

// @desc    Get Category for Dropdown Items
// @route   GET /inventory/get-all-category
// @access  Private

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

// @desc    Update Category
// @route   PUT /inventory/update-category
// @access  Private

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

// @desc    Delete Category
// @route   DELETE /inventory/delete-category/:ID
// @access  Private

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

// @desc    Create Sub-Category
// @route   POST /inventory/create-subcategory
// @access  Private

const create_subcategory = async (req, res, next) => {
  const subcategoryData = req.body;
  try {
    const result = await Inventory_Subcategory.create(subcategoryData);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create Classification
// @route   POST /inventory/create-classification
// @access  Private

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

// @desc    both update subcategory and classification
// @route   PUT /inventory/update-subcategory
// @access  Private

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

// @desc    DELETE sub-category
// @route   DELETE /inventory/delete-subcategory/:ID
// @access  Private

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

// @desc    Create Inventory Item
// @route   POST /inventory/create-item
// @access  Private

const create_Inventory_item = async (req, res, next) => {
  const inventoryData = req.body;

  try {
    const itemResult = await Inventory_Item.create({
      Item_name: inventoryData.item_name,
      Item_category: inventoryData.item_category,
      Item_subcategory: inventoryData.item_subcategory,
      Item_classification: inventoryData.item_classification,
      Item_origin_branch: inventoryData.item_origin_branch,
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

// @desc    Get Item
// @route   GET /inventory/get-item
// @access  Private

const get_items = async (req, res, next) => {
  try {
    const result = await Inventory_Item.findAll({
      include: [
        {
          model: Inventory_Stocks,
          as: "inv_stocks", // use your association alias
          where: { Item_status: "Available" },
          attributes: [], // Don't include the actual stock records
          required: false, // Use LEFT JOIN so items with 0 available stocks still appear
        },
      ],
      attributes: {
        include: [
          [
            sequelize.fn("COUNT", sequelize.col("inv_stocks.ID")),
            "available_count",
          ],
        ],
      },
      group: ["Inventory_Item.ID"],
      subQuery: false,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Item
// @route   GET /inventory/get-stocks
// @access  Private

const get_stocks = async (req, res, next) => {
  const { Item_ID } = req.query;

  try {
    const result = await Inventory_Stocks.findAll({
      where: { Item_ID },
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Edit Item
// @route   PUT /inventory/update-item
// @access  Private

const update_item = async (req, res, next) => {
  const editData = req.body;

  try {
    const result = await Inventory_Item.update(
      {
        Item_name: editData.Item_name,
        Item_category: editData.Item_category,
        Item_subcategory: editData.Item_subcategory,
        Item_classification: editData.Item_classification,
      },
      { where: { ID: editData.ID } }
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Replenish Stocks
// @route   PUT /inventory/replenish-stocks
// @access  Private

const replenish_stock = async (req, res, next) => {
  const stockData = req.body;

  try {
    const result = await Inventory_Stocks.bulkCreate(stockData, {
      validate: true,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    DELETE item
// @route   DELETE /inventory/delete-item/:ID
// @access  Private

const delete_item = async (req, res, next) => {
  const { ID } = req.params;

  try {
    const result = await Inventory_Item.destroy({ where: { ID } });

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
  update_category,
  update_subcategory,
  delete_category,
  delete_subcategory,
  create_Inventory_item,
  get_all_category,
  get_items,
  get_stocks,
  update_item,
  replenish_stock,
  delete_item,
};
