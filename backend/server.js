const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const db = require("./models");
const cors = require("cors");
const cookies = require("cookie-parser");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHanlder");

//NODE PACKAGE FOR API CONNECTION
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "200mb" }));
app.use(express.json());
app.use(cors());
app.use(cookies());
//app.use(helmet());

//API ROUTES
app.use("/users", require("./routes/UserRoute"));
app.use("/inventory", require("./routes/InventoryRoute"));
app.use("/documents", require("./routes/DocumentRoute"));
app.use("/signatories", require("./routes/SignatoryRoute"));

app.use(errorHandler);

//ACCESS LOCAL FILES

app.use("/media", express.static("media"));

//SERVER FUNCTION TO START
db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("server running");
  });
});
