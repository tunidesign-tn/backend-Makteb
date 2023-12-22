const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
require("./database-mysql");
const cors = require("cors");
const paginate = require("express-paginate");
const users = require("./routes/user.routes");
const appoinment=require('./routes/folderdata.routes')
const app = express();

const PORT = process.env.PORT || 5000;

let server = app.listen(PORT, function () {
  console.log(`Server running on ${PORT}`);
});

app.use(
  bodyParser.urlencoded({
    limit: "5000mb",
  })
);

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(fileUpload());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Routes

app.use(users);
app.use(appoinment);

app.get("/", (req, res) => {
  res.send("Welcome To TuniDesign-al-makteb  Backend server");
});
