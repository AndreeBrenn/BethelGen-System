const {
  Inventory_Category,
  Inventory_Subcategory,
  Inventory_Item,
  Inventory_Stocks,
  Inventory_Request,
  Users,
  sequelize,
} = require("../models");
const { Op, QueryTypes } = require("sequelize");
const fs = require("fs");

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

// @desc    Get Filtered Items for Dropdown Assign
// @route   GET /inventory/get-filtered-items
// @access  Private

const get_filtered_items = async (req, res, next) => {
  const { Item_category, Item_subcategory, Item_classification } = req.query;

  try {
    const result = await Inventory_Item.findAll({
      where: {
        Item_category,
        Item_classification,
        Item_subcategory,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Documents Item
// @route   GET /inventory/get-documents
// @access  Private

const get_documents = async (req, res, next) => {
  const { classification } = req.query;

  try {
    const result = await Inventory_Item.findAll({
      where: {
        Item_category: "Fixed Assets",
        Item_subcategory: "Documents",
        Item_classification: classification,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Item
// @route   GET /inventory/get-item
// @access  Private

const get_items = async (req, res, next) => {
  const { search, offset, limit, subcategory } = req.query;

  try {
    const whereClause = {
      ...(search && {
        Item_name: { [Op.iLike]: `%${search}%` },
      }),
      // Add subcategory filtering logic
      ...(subcategory === "Documents"
        ? { Item_subcategory: "Documents" }
        : subcategory
        ? { Item_subcategory: subcategory }
        : { Item_subcategory: { [Op.ne]: "Documents" } }), // Exclude Documents when subcategory is empty/null
    };

    const totalCount = await Inventory_Item.count({
      where: whereClause,
      include: [
        {
          model: Inventory_Stocks,
          as: "inv_stocks",
          where: { Item_status: "Available" },
          attributes: [],
          required: false,
        },
      ],
      group: ["Inventory_Item.ID"],
      distinct: true,
    });

    // Get the rows
    const rows = await Inventory_Item.findAll({
      where: whereClause,
      include: [
        {
          model: Inventory_Stocks,
          as: "inv_stocks",
          where: { Item_status: "Available" },
          attributes: [],
          required: false,
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
      offset,
      limit,
    });

    const result = {
      count: Array.isArray(totalCount) ? totalCount.length : totalCount,
      rows: rows,
    };

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Item
// @route   GET /inventory/get-stocks
// @access  Private

const get_stocks = async (req, res, next) => {
  const { Item_ID, search, offset, limit } = req.query;

  try {
    const result = await Inventory_Stocks.findAndCountAll({
      where: {
        Item_ID,
        ...(search && {
          [Op.or]: [
            { Item_serial: { [Op.iLike]: `%${search}%` } },
            { Item_branch: { [Op.iLike]: `%${search}%` } },
          ],
        }),
      },
      offset,
      limit,
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

//#region INVENTORY REQUEST

// @desc    Add Request Inventory
// @route   POST /inventory/create-request
// @access  Private

const create_inventory_request = async (req, res, next) => {
  const inventoryData = req.body;

  try {
    const result = await Inventory_Request.create(inventoryData);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    get request by User Only
// @route   GET /inventory/get-personal-request
// @access  Private

const get_inventory_request_personal = async (req, res, next) => {
  const { search, offset, limit, ID } = req.query;

  try {
    const whereClause = {
      USER_ID: ID,
      ...(search && {
        [Op.or]: {
          Item_name: { [Op.iLike]: `%${search}%` },
          Item_branch: { [Op.iLike]: `%${search}%` },
          "$Item_userID.FirstName$": { [Op.iLike]: `%${search}%` },
          "$Item_userID.LastName$": { [Op.iLike]: `%${search}%` },
        },
      }),
    };

    const result = await Inventory_Request.findAndCountAll({
      include: [
        {
          model: Users,
          as: "Item_userID",
          attributes: [
            "LastName",
            "FirstName",
            "Role",
            "Email",
            "Department",
            "Position",
          ],
        },
      ],
      where: whereClause,
      offset,
      limit,
      order: ["ID"],
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete  Personal Request Inventory
// @route   DELETE /inventory/delete-personal-request/:ID
// @access  Private

const delete_request_inventory = async (req, res, next) => {
  const { ID } = req.params;

  try {
    const request = await Inventory_Request.findByPk(ID);

    if (request.Item_status == "Approved") {
      return res.status(403).json({ message: "This item cannot be deleted" });
    }

    const result = await Inventory_Request.destroy({ where: { ID } });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get All  Request Inventory
// @route   GET /inventory/get-all-request
// @access  Private

const get_all_request = async (req, res, next) => {
  const { search, offset, limit } = req.query;

  try {
    const whereClause = {
      ...(search && {
        [Op.or]: [
          { Item_name: { [Op.iLike]: `%${search}%` } },
          { Item_branch: { [Op.iLike]: `%${search}%` } },
          { "$Item_userID.FirstName$": { [Op.iLike]: `%${search}%` } },
          { "$Item_userID.LastName$": { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    // Get count
    const count = await Inventory_Request.count({
      include: [
        {
          model: Users,
          as: "Item_userID",
          attributes: [],
        },
      ],
      where: whereClause,
      distinct: true,
      col: "ID",
    });

    // Get rows
    const rows = await Inventory_Request.findAll({
      include: [
        {
          model: Users,
          as: "Item_userID",
          attributes: ["LastName", "FirstName", "Role", "Email", "Department"],
        },
        {
          model: Inventory_Stocks,
          as: "Inv_request",
        },
      ],
      where: whereClause,
      limit,
      offset,
      order: [["ID", "DESC"]],
    });

    const result = { count, rows };

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update request based on approving of the user
// @route   PUT /inventory/update-request
// @access  Private

const update_request = async (req, res, next) => {
  const requestData = req.body;

  try {
    const imagesData = req.files || [];

    if (imagesData.length != 0) {
      imagesData.forEach((element) => {
        fs.rename(
          `./media/${element.filename}`,
          `./media/${element.filename}.png`,
          (err) => console.log(err)
        );
      });

      const arrayUpload = imagesData.map((item) => {
        return `/media/${item.filename}.png`;
      });

      const result = await Inventory_Request.update(
        {
          Item_value: JSON.parse(requestData.Item_value),
          Item_signatories: JSON.parse(requestData.Item_signatories),
          Item_image: arrayUpload,
        },
        {
          where: { ID: requestData.ID },
        }
      );

      return res.status(200).json(result);
    }

    const result = await Inventory_Request.update(
      {
        ...requestData,
        Item_signatories: JSON?.parse(requestData?.Item_signatories),
        Item_value: JSON?.parse(requestData?.Item_value),
      },
      {
        where: { ID: requestData.ID },
      }
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const item_received = async (req, res, next) => {
  const itemData = req.body;

  try {
    const result = await Inventory_Request.update(
      { Item_status: itemData.status },
      { where: { ID: itemData.ID } }
    );

    return res.status(200).json({ message: "Data updated" });
  } catch (error) {
    next(error);
  }
};

//#endregion

//#region SHIPMENT

/* THIS REGION ALLOWS MULTIPLE CALL TO DB BECAUSE OF THE RELATIONSHIP BETWEEN 3 TABLES
  INVENTORY_ITEM
  INVENTORY_REQUEST
  INVENTORY_STOCKS
*/

const get_inventory_shipped_items = async (req, res, next) => {
  const itemData = req.body;

  try {
    const result = await Inventory_Item.findAll({
      where: {
        ID: {
          [Op.in]: itemData.ids,
        },
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const ship_items = async (req, res, next) => {
  const itemData = req.body;

  try {
    const whereNotExisting = {
      [Op.or]: itemData.items.map((q) => ({
        Item_ID: q.Item_ID,
        Item_serial: q.Item_serial,
      })),
    };

    const existingRecord = await Inventory_Stocks.findAll({ whereNotExisting });

    const missing = itemData.items.filter(
      (fil) =>
        !existingRecord.some(
          (som) =>
            som.Item_ID == fil.Item_ID && som.Item_serial == fil.Item_serial
        )
    );

    if (missing.length != 0) {
      return res.status(404).json({
        message: `Some Items do not exist`,
        items: missing,
      });
    }

    const unavailable = itemData.items.filter((fil) =>
      existingRecord.some(
        (som) =>
          som.Item_ID == fil.Item_ID &&
          som.Item_serial == fil.Item_serial &&
          som.Item_status === "Unavailable"
      )
    );

    if (unavailable.length !== 0) {
      return res.status(400).json({
        message: `Some of items are unavailable`,
        items: unavailable,
      });
    }

    // Build CASE statements with proper named parameters
    const statusCases = itemData.items
      .map(
        (data, index) =>
          `WHEN ("Item_ID" = :itemId${index} AND "Item_serial" = :serial${index}) THEN :status${index}`
      )
      .join(" ");

    const branchCase = itemData.items
      .map(
        (data, index) =>
          `WHEN ("Item_ID" = :itemId${index} AND "Item_serial" = :serial${index}) THEN :branch${index}`
      )
      .join(" ");

    const requestCase = itemData.items
      .map(
        (data, index) =>
          `WHEN ("Item_ID" = :itemId${index} AND "Item_serial" = :serial${index}) THEN :request${index}`
      )
      .join(" ");

    // Build replacements object - branch and Inv_requestID are same for all items
    const replacements = {};

    itemData.items.forEach((item, index) => {
      replacements[`itemId${index}`] = item.Item_ID;
      replacements[`serial${index}`] = item.Item_serial;
      replacements[`status${index}`] = "Unavailable";
      replacements[`branch${index}`] = itemData.branch; // From root level
      replacements[`request${index}`] = itemData.Inv_requestID; // From root level
    });

    // Add the IN clause arrays
    replacements.itemIds = itemData.items.map((d) => d.Item_ID);
    replacements.serials = itemData.items.map((d) => d.Item_serial);

    await sequelize.query(
      `
      UPDATE "Inventory_Stocks"
      SET
        "Item_status" = CASE
          ${statusCases}
          ELSE "Item_status"
        END,
        "Item_branch" = CASE
          ${branchCase}
          ELSE "Item_branch"
        END,
        "Inv_requestID" = CASE
         ${requestCase}
         ELSE "Inv_requestID"
        END
      WHERE "Item_ID" IN (:itemIds)
      AND "Item_serial" IN (:serials)
    `,
      {
        replacements,
        type: QueryTypes.UPDATE,
      }
    );

    await Inventory_Request.update(
      {
        Item_signatories: itemData.Item_signatories,
        Item_status: "Shipped",
      },
      { where: { ID: itemData.Inv_requestID } }
    );

    return res.status(200).json({
      message: "Items shipped successfully",
      count: itemData.items.length,
    });
  } catch (error) {
    console.error("Error in ship_items:", error);
    next(error);
  }
};

//#endregion

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
  get_documents,
  get_items,
  get_stocks,
  update_item,
  replenish_stock,
  delete_item,
  create_inventory_request,
  get_inventory_request_personal,
  delete_request_inventory,
  get_all_request,
  update_request,
  get_filtered_items,
  ship_items,
  get_inventory_shipped_items,
  item_received,
};
