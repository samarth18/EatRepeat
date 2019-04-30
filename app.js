const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const app = express();

const {
  getHomePage,
  getRestaurants,
  getOrdersPage
} = require("./routes/index");
const {
  registerUserPage,
  registerUser,
  loginUserPage,
  loginUser
} = require("./routes/authenticate");
const {
  userDetailsPage,
  userDetailsUpdate,
  paymentPage,
  checkoutUser,
  getConfirmPage,
  confirmOrder,
  cancelOrder,
  offersPage,
  offersUpdate
} = require("./routes/checkout");
const { showMenu } = require("./routes/menu");
const port = 5000;
global.restaurant = "";
global.customer = "";
global.order = "";

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection({
  host: "localhost",
  user: "", // Please enter username and password here
  password: "",
  database: "foodDelivery"
});

// connect to database
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;

// configure middleware
app.set("port", process.env.port || port); // set express to use this port
app.set("views", __dirname + "/views"); // set express to look in this folder to render our view
app.set("view engine", "ejs"); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, "public"))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get("/register", registerUserPage);
app.get("/login", loginUserPage);
app.get("/", getHomePage);
app.get("/menu/:id", showMenu);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/orders", getOrdersPage);
app.post("/menu/:id", checkoutUser);
app.get("/restaurants", getRestaurants);
app.get("/confirm", getConfirmPage);
app.post("/confirm", confirmOrder);
app.get("/payment", paymentPage);
app.post("/payment", cancelOrder);
app.get("/user-details", userDetailsPage);
app.post("/user-details", userDetailsUpdate);
app.get("/offers", offersPage);
app.post("/offers", offersUpdate);
app.get("");
// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
