const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const paginate = require("express-paginate");
const usersRoutes = require("./routes/user.routes");
const folderdata = require('./routes/folderdata.routes');
const rappellesdata = require('./routes/rappelles.routes');
const Executor=require('./routes/Executor.routes')
const Payements= require('./routes/Payements.routes')
const support_Invoice=require('./routes/support_Invoice.routes')
const support_text_du_jugement=require('./routes/support_text_du_jugement.routes')
const support_tribunal=require('./routes/support_tribunal.routes')
const Proxy= require ('./routes/proxy.routes')
const database = require("./database-mysql");


const app = express();
const PORT = process.env.PORT || 8000;

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
app.use(Executor)
app.use(Payements)
app.use(support_Invoice)
app.use(support_text_du_jugement)
app.use(support_tribunal)
app.use(Proxy)

app.get("/", (req, res) => {
  res.send("Welcome To TuniDesign-al-makteb  Backend server");
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