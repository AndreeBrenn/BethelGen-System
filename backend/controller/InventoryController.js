const {
  Inventory_Category,
  Inventory_Subcategory,
  Inventory_Item,
  Inventory_Stocks,
  Inventory_Request,
  Users,
  sequelize,
} = require("../models");
const { Op, QueryTypes, Sequelize } = require("sequelize");
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
      policy_code: inventoryData.policy_code,
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
      order: [["Item_serial", "ASC"]],
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

// @desc    Get item branch
// @route   GET /inventory/branch-items
// @access  Private

const get_branch_items = async (req, res, next) => {
  const { branch, searchTerm, limit, offset } = req.query;

  try {
    const whereClause = {
      ...(searchTerm && {
        [Op.or]: [
          { ID: parseInt(searchTerm) || -1 },
          { Item_name: { [Op.iLike]: `%${searchTerm}%` } },
        ],
      }),
    };

    const includeClause = {
      model: Inventory_Stocks,
      as: "inv_stocks",
      where: { Item_branch: branch },
      attributes: [], // Keep empty for the main query
      required: true,
    };

    // Separate count and find
    const [count, rows] = await Promise.all([
      Inventory_Item.count({
        where: whereClause,
        include: [includeClause],
        distinct: true,
        col: "ID",
      }),
      Inventory_Item.findAll({
        where: whereClause,
        include: [
          {
            ...includeClause,
            attributes: [], // Still keep empty to avoid selecting all stock fields
          },
        ],
        attributes: {
          include: [
            [
              sequelize.fn("COUNT", sequelize.col("inv_stocks.ID")),
              "stock_count",
            ],
          ],
        },
        group: ["Inventory_Item.ID"],
        limit,
        offset,
        subQuery: false,
        order: [["Item_name", "ASC"]],
        raw: true,
      }),
    ]);

    return res.status(200).json({
      rows: rows,
      count: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Stocks branch
// @route   GET /inventory/branch-stocks
// @access  Private

const get_stocks_branch = async (req, res, next) => {
  const { Item_ID, search, branch, offset, limit } = req.query;

  try {
    const result = await Inventory_Stocks.findAndCountAll({
      where: {
        Item_ID,
        Item_branch: branch,
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
    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { Item_branch: { [Op.iLike]: `%${search}%` } },
          Sequelize.where(
            Sequelize.cast(Sequelize.col("Inventory_Request.ID"), "varchar"),
            { [Op.iLike]: `%${search}%` }
          ),
          { "$Item_userID.FirstName$": { [Op.iLike]: `%${search}%` } },
          { "$Item_userID.LastName$": { [Op.iLike]: `%${search}%` } },
          { "$Item_userID.Department$": { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const includeClause = [
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
        required: false,
      },
      {
        model: Inventory_Stocks,
        as: "Inv_request",
        required: false,
        separate: true, // This runs a separate query and prevents cartesian product
        limit: 10, // Limit child records per parent
        order: [["createdAt", "DESC"]], // Optional: order the child records
      },
    ];

    // Separate count and findAll
    const [count, rows] = await Promise.all([
      Inventory_Request.count({
        where: whereClause,
        include: includeClause,
        distinct: true,
        col: "ID",
      }),
      Inventory_Request.findAll({
        include: includeClause,
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["ID", "DESC"]],
        subQuery: true, // Changed to true
        distinct: true, // Added this back
      }),
    ]);

    const result = { count, rows };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in get_all_request:", error);
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

    // IF REQUEST DON'T HAVE AN IMAGE

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

// @desc    Get pending of Inventory_request for signatories based on User
// @route   GET /inventory/pending-for-me
// @access  Private

const get_pending = async (req, res, next) => {
  const { page = 1, limit = 10, search = "", userId } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Build where conditions
    const whereConditions = {
      Item_status: {
        [Op.notIn]: ["Shipped", "Received", "Rejected"],
      },
      Item_signatories: {
        [Op.ne]: null,
      },
      [Op.and]: [
        Sequelize.literal(`
          EXISTS (
            SELECT 1 
            FROM jsonb_array_elements("Inventory_Request"."Item_signatories") AS sig
            WHERE sig->>'ID' = '${userId}'
          )
        `),
        Sequelize.literal(`
          (
            SELECT (sig->>'Order')::int
            FROM jsonb_array_elements("Inventory_Request"."Item_signatories") AS sig
            WHERE sig->>'ID' = '${userId}'
            LIMIT 1
          ) = (
            SELECT COUNT(*)
            FROM jsonb_array_elements("Inventory_Request"."Item_signatories") AS sig
            WHERE sig->>'Status' = 'Approved'
          )
        `),
        Sequelize.literal(`
          EXISTS (
            SELECT 1
            FROM jsonb_array_elements("Inventory_Request"."Item_signatories") AS sig
            WHERE sig->>'ID' = '${userId}'
            AND sig->>'Status' != 'Approved'
          )
        `),
      ],
    };

    // Add search if provided
    if (search) {
      whereConditions[Op.or] = [
        Sequelize.where(
          Sequelize.cast(Sequelize.col("Inventory_Request.ID"), "varchar"),
          { [Op.like]: `%${search}%` }
        ),
        Sequelize.where(
          Sequelize.fn(
            "LOWER",
            Sequelize.fn(
              "concat",
              Sequelize.col("Item_userID.FirstName"),
              " ",
              Sequelize.col("Item_userID.LastName")
            )
          ),
          { [Op.like]: `%${search.toLowerCase()}%` }
        ),
        Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("Item_userID.Department")),
          { [Op.like]: `%${search.toLowerCase()}%` }
        ),
      ];
    }

    const { count, rows } = await Inventory_Request.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Users,
          as: "Item_userID",
          attributes: ["FirstName", "LastName", "Role", "Email", "Department"],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    res.json({
      count,
      rows,
    });
  } catch (error) {
    console.error("Error in get_pending:", error);
    next(error);
  }
};

//#endregion

//#region SHIPMENT

// @desc    Get automatic serial.
// @route   GET /inventory/get-serial-automatic
// @access  Private

const get_serial_automatic = async (req, res, next) => {
  const { Item_ID, limit, Item_document_category } = req.query;

  try {
    const whereClause = {
      Item_ID,
      Item_status: "Available",
    };

    if (Item_document_category) {
      whereClause.Item_document_category = Item_document_category;
    }

    const result = await Inventory_Stocks.findAll({
      attributes: ["Item_serial"],
      where: whereClause,
      limit: limit,
      order: [["Item_serial", "ASC"]],
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get stocks.
// @route   GET /inventory/get-stocks-for-ship-or-received
// @access  Private

const get_shipped_or_received_items = async (req, res, next) => {
  const { offset, limit, request_ID } = req.query;

  try {
    const result = await Inventory_Stocks.findAndCountAll({
      where: { Inv_requestID: request_ID },
      limit,
      offset,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* THIS REGION ALLOWS MULTIPLE CALL TO DB BECAUSE OF THE RELATIONSHIP BETWEEN 3 TABLES
  INVENTORY_ITEM
  INVENTORY_REQUEST
  INVENTORY_STOCKS
*/

// @desc    Get all the shipped inventory for receiving.
// @route   POST /inventory/get-shipped-items
// @access  Private

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

// @desc    Update the Inventory_Stocks and Inventory_Request
// @route   PUT /inventory/ship-items
// @access  Private

const ship_items = async (req, res, next) => {
  const itemData = req.body;

  try {
    // 1. Use Set for O(1) lookups instead of nested loops
    const itemKeys = itemData.items.map(
      (item) => `${item.Item_ID}|${item.Item_serial}`
    );
    const itemKeySet = new Set(itemKeys);

    // 2. Query existing records in batches to avoid parameter limits
    const QUERY_BATCH_SIZE = 1000;
    const existingRecords = [];

    for (let i = 0; i < itemData.items.length; i += QUERY_BATCH_SIZE) {
      const batch = itemData.items.slice(i, i + QUERY_BATCH_SIZE);

      const itemPairs = batch
        .map((_, idx) => `(:itemId${idx}, :serial${idx})`)
        .join(", ");

      const replacements = {};
      batch.forEach((item, idx) => {
        replacements[`itemId${idx}`] = item.Item_ID;
        replacements[`serial${idx}`] = item.Item_serial;
      });

      const batchResults = await sequelize.query(
        `
        SELECT "Item_ID", "Item_serial", "Item_status"
        FROM "Inventory_Stocks"
        WHERE ("Item_ID", "Item_serial") IN (${itemPairs})
        `,
        {
          replacements,
          type: QueryTypes.SELECT,
        }
      );

      existingRecords.push(...batchResults);
    }

    // 3. Build lookup map for O(1) access
    const existingMap = new Map();
    existingRecords.forEach((record) => {
      const key = `${record.Item_ID}|${record.Item_serial}`;
      existingMap.set(key, record);
    });

    // 4. Find missing and unavailable items efficiently
    const missing = [];
    const unavailable = [];

    for (const item of itemData.items) {
      const key = `${item.Item_ID}|${item.Item_serial}`;
      const existing = existingMap.get(key);

      if (!existing) {
        missing.push(item);
      } else if (existing.Item_status === "Unavailable") {
        unavailable.push(item);
      }
    }

    if (missing.length !== 0) {
      return res.status(404).json({
        message: `Some Items do not exist`,
        items: missing,
      });
    }

    if (unavailable.length !== 0) {
      return res.status(400).json({
        message: `Some of items are unavailable`,
        items: unavailable,
      });
    }

    // 5. Use transaction to keep temp table alive
    const transaction = await sequelize.transaction();

    try {
      // Create temp table within transaction
      await sequelize.query(
        `
        CREATE TEMP TABLE temp_ship_items (
          item_id INT,
          item_serial TEXT
        ) ON COMMIT DROP
        `,
        { transaction }
      );

      // 6. Batch insert into temp table (chunk to avoid parameter limits)
      const BATCH_SIZE = 1000;
      for (let i = 0; i < itemData.items.length; i += BATCH_SIZE) {
        const batch = itemData.items.slice(i, i + BATCH_SIZE);
        const values = batch
          .map((_, idx) => `(:itemId${idx}, :serial${idx})`)
          .join(", ");

        const replacements = {};
        batch.forEach((item, idx) => {
          replacements[`itemId${idx}`] = item.Item_ID;
          replacements[`serial${idx}`] = item.Item_serial;
        });

        await sequelize.query(
          `INSERT INTO temp_ship_items (item_id, item_serial) VALUES ${values}`,
          { replacements, transaction }
        );
      }

      // 7. Single UPDATE using JOIN with temp table
      await sequelize.query(
        `
        UPDATE "Inventory_Stocks" AS inv
        SET
          "Item_status" = :status,
          "Item_branch" = :branch,
          "Inv_requestID" = :requestId
        FROM temp_ship_items AS temp
        WHERE inv."Item_ID" = temp.item_id
          AND inv."Item_serial" = temp.item_serial
        `,
        {
          replacements: {
            status: "Unavailable",
            branch: itemData.branch,
            requestId: itemData.Inv_requestID,
          },
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      // 8. Update request status
      await Inventory_Request.update(
        {
          Item_signatories: itemData.Item_signatories,
          Item_status: "Shipped",
        },
        { where: { ID: itemData.Inv_requestID }, transaction }
      );

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({
        message: "Items shipped successfully",
        count: itemData.items.length,
      });
    } catch (error) {
      // Rollback on error
      await transaction.rollback();
      throw error;
    }
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
  get_branch_items,
  get_stocks_branch,
  create_inventory_request,
  get_inventory_request_personal,
  delete_request_inventory,
  get_all_request,
  update_request,
  get_filtered_items,
  ship_items,
  get_inventory_shipped_items,
  get_pending,
  get_shipped_or_received_items,
  get_serial_automatic,
};
