const { Op } = require("sequelize");
const { Dynamic_Branch } = require("../models");

// @desc    Create Branch
// @route   POST /Branch/create-branch
// @access  Private

const create_branch = async (req, res, next) => {
  const branchData = req.body;
  try {
    const result = await Dynamic_Branch.create(branchData);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get Branch
// @route   GET /Branch/get-branch
// @access  Private

const get_branch = async (req, res, next) => {
  const { search, offset, itemsPerPage } = req.query;

  try {
    const result = await Dynamic_Branch.findAndCountAll({
      where: {
        ...(search && {
          [Op.or]: [{ Branch_name: { [Op.iLike]: `%${search}%` } }],
        }),
      },

      limit: itemsPerPage,
      offset,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// @desc    Get All Branch
// @route   GET /Branch/get-all-branch
// @access  Private

const get_all_branch = async (req, res, next) => {
  try {
    const result = await Dynamic_Branch.findAll();

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Edit Branch
// @route   PUT /Branch/edit-branch
// @access  Private

const edit_branch = async (req, res, next) => {
  const { Branch_name, ID } = req.body;
  try {
    const result = await Dynamic_Branch.update(
      { Branch_name },
      { where: { ID } }
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Branch
// @route   Delete /Branch/delete-branch
// @access  Private

const delete_branch = async (req, res, next) => {
  const { ID } = req.params;

  try {
    const result = await Dynamic_Branch.destroy({ where: { ID } });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create_branch,
  get_branch,
  get_all_branch,
  edit_branch,
  delete_branch,
};
