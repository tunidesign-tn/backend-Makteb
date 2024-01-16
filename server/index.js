const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const paginate = require("express-paginate");
const usersRoutes = require("./routes/user.routes");
const folderdata = require('./routes/folderdata.routes');
const rappellesdata=require('./routes/rappelles.routes')
const database = require("./database-mysql");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ limit: "5000mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(paginate.middleware(10, 50));

// Routes
app.use(usersRoutes);
app.use(folderdata);
app.use(rappellesdata)
app.get("/", (req, res) => {
  res.send("Welcome To TuniDesign-al-makteb server");
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle unhandled exceptions
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;