const fs = require("fs");
//var customerKey = 0;
module.exports = {
  registerUserPage: (req, res) => {
    res.render("register-user.ejs", {
      title: "Welcome to foodo | Sign Up",
      message: ""
    });
  },
  registerUser: (req, res) => {
    let message = "";
    //customerKey = customerKey + 1;
    let customer_ID = 1;
    let customer_name = req.body.customer_name;
    //console.log(req.body);
    let address = req.body.address;
    let phone = req.body.phone;
    let loginID = req.body.login_ID;
    let password = req.body.passwd;

    let custIdQuery = "Select count(customer_ID) AS numCount from Customer";
    db.query(custIdQuery, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      } else {
          customer_ID = result[0].numCount+1;
          //console.log(customer_ID);
      }
    });

    let usernameQuery =
      "SELECT * FROM Customer WHERE login_ID = '" + loginID + "'";
    db.query(usernameQuery, (err, result) => {
      //console.log(result);
      if (err) {
        return res.status(500).send(err);
      } else if (result.length > 0) {
        message = "Username already exists";
        res.render("register-user.ejs", {
          message,
          title: "Welcome to foodo | Sign Up"
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
            return res.status(500).send(err);
          }
          let query = "CALL allRestaurants()"
        db.query(query, (err, result) => {
      if (err) {
        res.redirect("/");
      }
      res.render("index.ejs", {
        restaurants: result[0],
        title: "Welcome to Foodo | View Restaurants"
      });
    });
        });
      }
    });
  },
  loginUserPage: (req, res) => {
    res.render("login-user.ejs", {
      title: "Welcome to Foodo | Log In",
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
      console.log(result);
      if (err) {
        return res.status(500).send(err);
      } else if (result.length === 0) {
        message = "Invalid Username or Password";
        res.render("login-user.ejs", {
          message,
          title: "Welcome to Foodo | Sign Up"
        });
      } else {
        let query = "CALL allRestaurants()"
        db.query(query, (err, result) => {
      if (err) {
        res.redirect("/");
      }
      res.render("index.ejs", {
        restaurants: result[0],
        title: "Welcome to Foodo | View Restaurants"
      });
    });
      }
    });
  }
};
