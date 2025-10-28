const multer = require("multer");
const upload = multer({ dest: "./media" });

const uploadSupportingForms = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  // If no multipart data, just continue
  if (!contentType.includes("multipart/form-data")) {
    req.files = [];
    return next();
  }

  upload.array("images", 10)(req, res, (err) => {
    // Ignore "unexpected end of form" when no files sent
    if (err && err.message && err.message.includes("Unexpected end of form")) {
      console.log("No files uploaded (optional)");
      req.files = [];
      return next();
    }

    // Other errors should still be handled
    if (err) {
      return next(err);
    }

    next();
  });
};

module.exports = {
  uploadSupportingForms,
};
