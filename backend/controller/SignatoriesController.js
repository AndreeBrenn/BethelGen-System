const { Dynamic_Signatories } = require("../models");

// @desc    Get all signatories
// @route   GET /signatory/get-all-signatory
// @access  Private

const get_signatories = async (req, res, next) => {
  try {
    const result = await Dynamic_Signatories.findAll();

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new Signatory
// @route   POST /signatory/create-signatory
// @access  Private

const create_signatory = async (req, res, next) => {
  const signatoryData = req.body;

  try {
    const result = await Dynamic_Signatories.create(signatoryData);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Re order Signatory
// @route   PUT /signatory/Re-order-signatory
// @access  Private

const reorder_signatory = async (req, res, next) => {
  const signatoryData = req.body;

  try {
    const result = await Dynamic_Signatories.bulkCreate(signatoryData, {
      updateOnDuplicate: ["Order"],
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Re order Signatory
// @route   DELETE /signatory/delete-signatory
// @access  Private

const remove_signatory = async (req, res, next) => {
  const { ID } = req.params;

  try {
    await Dynamic_Signatories.destroy({ where: { ID } });

    const currentSignatories = await Dynamic_Signatories.findAll();

    const newOrder = currentSignatories
      .sort((a, b) => a.Order - b.Order)
      .map((data, index) => {
        return { ...data.toJSON(), Order: index + 1 };
      });

    const result = await Dynamic_Signatories.bulkCreate(newOrder, {
      updateOnDuplicate: ["Order"],
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get_signatories,
  create_signatory,
  reorder_signatory,
  remove_signatory,
};
