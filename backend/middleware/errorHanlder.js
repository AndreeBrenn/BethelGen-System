const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: `${e.path} already exists`,
      })),
    });
  }

  // Sequelize foreign key constraint errors
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      success: false,
      message: "Invalid reference - related record not found",
    });
  }

  // Sequelize database errors
  if (err.name === "SequelizeDatabaseError") {
    return res.status(400).json({
      success: false,
      message: "Database error occurred",
    });
  }

  // Sequelize connection errors
  if (err.name === "SequelizeConnectionError") {
    return res.status(503).json({
      success: false,
      message: "Database connection error",
    });
  }

  // Custom errors (when you throw your own errors)
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

module.exports = errorHandler;
