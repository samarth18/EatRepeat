const fs = require("fs");
//var customerKey = 0;
module.exports = {
  registerUserPage: (req, res) => {
    res.render("register-user.ejs", {
      title: "Welcome to EatRepeat | Sign Up",
      message: ""
    });
  },
  registerUser: (req, res) => {
    let message = "";
    //customerKey = customerKey + 1;
    let customer_ID = 1;
    let customer_name = req.body.customer_name;
    let address = req.body.address;
    let phone = req.body.phone;
    let loginID = req.body.login_ID;
    let password = req.body.passwd;

    let custIdQuery = "Select count(customer_ID) AS numCount from Customer";
    db.query(custIdQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else {
        customer_ID = result[0].numCount + 1;
        customer = customer_ID;
      }
    });
    let usernameQuery =
      "SELECT * FROM Customer WHERE login_ID = '" + loginID + "'";
    db.query(usernameQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else if (result.length > 0) {
        message = "Username already exists";
        res.render("register-user.ejs", {
          message,
          title: "Welcome to EatRepeat | Sign Up"
        });
      } else {
        // send the customer's details to the database
        let query =
          "INSERT INTO Customer (customer_ID, customer_name, address, phone, login_ID, passwd) VALUES ('" +
          customer_ID +
          "', '" +
          customer_name +
          "', '" +
          address +
          "', '" +
          phone +
          "', '" +
          loginID +
          "', '" +
          password +
          "')";
        db.query(query, (err, result) => {
          if (err) {
            res.render("login-user.ejs", {
              message: "Oops! An error occurred",
              title: "Welcome to EatRepeat - Sign In"
            });
          }
          res.redirect("/restaurants");
        });
      }
    });
  },
  loginUserPage: (req, res) => {
    res.render("login-user.ejs", {
      title: "Welcome to EatRepeat | Log In",
      message: ""
    });
  },
  loginUser: (req, res) => {
    let loginID = req.body.login_ID;
    let password = req.body.passwd;

    let usernameQuery =
      "SELECT * FROM Customer WHERE login_ID = '" +
      loginID +
      "'" +
      "AND passwd = '" +
      password +
      "'";

    db.query(usernameQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else if (result.length === 0) {
        message = "Invalid Username or Password";
        res.render("login-user.ejs", {
          message,
          title: "Welcome to EatRepeat | Sign Up"
        });
      } else {
        let IDquery =
          "Select customer_ID from foodDelivery.Customer WHERE login_ID = '" +
          loginID +
          "'";
        db.query(IDquery, (err, rest) => {
          if (err) {
            res.render("login-user.ejs", {
              message: "Oops! An error occurred",
              title: "Welcome to EatRepeat - Sign In"
            });
          }
          customer = rest[0].customer_ID;
          res.redirect("/restaurants");
        });
      }
    });
  }
};
