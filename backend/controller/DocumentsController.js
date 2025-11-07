const { Dynamic_Document } = require("../models");

// @desc    Create a Dynamic Document
// @route   POST /Document/create-document
// @access  Private

const create_document = async (req, res, next) => {
  const documentData = req.body;

  try {
    const result = await Dynamic_Document.create({
      Schema: documentData.Schema,
      File_name: documentData.File_name,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single Document
// @route   GET /Document/get-single-document
// @access  Private

const get_single_document = async (req, res, next) => {
  const documentData = req.query;
  try {
    const result = await Dynamic_Document.findByPk(documentData.ID);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create_document,
  get_single_document,
};
