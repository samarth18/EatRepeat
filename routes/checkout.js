const fs = require("fs");

var arrOfItems;
var totprice;
var finalItems;

module.exports = {
  checkoutUser: (req, res) => {
    arrOfItems = [];
    let orderDetails = {};
    for (var key in req.body) {
      orderDetails = JSON.parse(key);
    }

    for (var key in orderDetails) {
      var itemID = key;
      var quantity = orderDetails[key][0];
      if (quantity > 0) {
        arrOfItems.push({
          itemID: key,
          name: orderDetails[key][1],
          quantity: quantity,
          price: orderDetails[key][2] * quantity
        });
      }
    }
    res.redirect("/confirm");
  },

  getConfirmPage: (req, res) => {
    let userQuery =
      "SELECT * FROM Customer WHERE customer_ID = '" + customer + "'";
    db.query(userQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else {
        res.render("confirm.ejs", {
          items: arrOfItems,
          customerDetails: result,
          title: "Welcome to EatRepeat | Confirm Order"
        });
      }
    });
  },

  confirmOrder: (req, res) => {
    let orderIdQuery = "Select count(order_ID) AS numCount from Orders";
    let orderID = 0;
    finalItems = [];
    db.query(orderIdQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else {
        orderID = result[0].numCount + 1;
        order = orderID;
        let orderDetails = {};
        for (var key in req.body) {
          orderDetails = JSON.parse(key);
        }
        totprice = 0;
        for (var key in orderDetails) {
          var p = orderDetails[key][2];
          totprice = +totprice + +p;
          finalItems.push({
            itemID: key,
            name: orderDetails[key][1],
            quantity: orderDetails[key][0],
            price: p
          });
        }
        let orderQuery =
          "INSERT INTO Orders (order_ID, total_price, order_status, customer_ID, rest_ID) VALUES ('" +
          orderID +
          "', '" +
          totprice +
          "', '" +
          "Placed" +
          "', '" +
          customer +
          "', '" +
          restaurant +
          "')";
        db.query(orderQuery, (err, result) => {
          if (err) {
            res.render("login-user.ejs", {
              message: "Oops! An error occurred",
              title: "Welcome to EatRepeat - Sign In"
            });
          }
          for (var key in orderDetails) {
            var itemID = key;
            var quantity = orderDetails[key][0];
            var name = orderDetails[key][1];
            var price = orderDetails[key][2];
            let itemQuery =
              "INSERT INTO order_contains_item (order_id, item_id, qty) VALUES ('" +
              orderID +
              "', '" +
              itemID +
              "', '" +
              quantity +
              "')";
            db.query(itemQuery, (err, result) => {
              if (err) {
                res.render("login-user.ejs", {
                  message: "Oops! An error occurred",
                  title: "Welcome to EatRepeat - Sign In"
                });
              }
            });
          }
          res.redirect("/user-details");
        });
      }
    });
  },
  userDetailsPage: (req, res) => {
    let userQuery =
      "SELECT * FROM Customer WHERE customer_ID = '" + customer + "'";
    db.query(userQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else {
        res.render("user-details.ejs", {
          customerDetails: result,
          title: "Welcome to EatRepeat | User Details"
        });
      }
    });
  },
  userDetailsUpdate: (req, res) => {
    let customer_name = req.body.fullname;
    let address = req.body.address;
    let phone = req.body.phone;
    let userDetailsQuery =
      "UPDATE Customer SET `customer_name` = '" +
      customer_name +
      "', `address` = '" +
      address +
      "', `phone` = '" +
      phone +
      "' WHERE `customer_ID` = '" +
      customer +
      "'";
    db.query(userDetailsQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else {
        res.redirect("/offers");
      }
    });
  },
  offersPage: (req, res) => {
    res.render("offers.ejs", {
      items: finalItems,
      totalPayment: totprice,
      message: "",
      title: "Welcome to EatRepeat | Add Coupon"
    });
  },
  offersUpdate: (req, res) => {
    let offer = req.body.offers;
    let offerQuery =
      "SELECT get_discount('" + offer + "', '" + totprice + "') AS discount";
    db.query(offerQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else {
        result.forEach(value => {
          if (value.discount !== null) {
            totprice = totprice - (totprice * value.discount) / 100;
            let orderTableUpdate =
              "UPDATE Orders SET `offer_ID` = '" +
              offer +
              "', `total_price` = '" +
              totprice +
              "' WHERE order_ID = '" +
              order +
              "'";
            db.query(orderTableUpdate, (err, result) => {
              if (err) {
                res.render("login-user.ejs", {
                  message: "Oops! An error occurred",
                  title: "Welcome to EatRepeat - Sign In"
                });
              }
              res.redirect("/payment");
            });
          } else {
            res.render("offers.ejs", {
              items: finalItems,
              totalPayment: totprice,
              message: "Invalid Coupon Code for this order",
              title: "Welcome to EatRepeat | Add Coupon"
            });
          }
        });
      }
    });
  },
  paymentPage: (req, res) => {
    let userQuery =
      "SELECT * FROM Customer WHERE customer_ID = '" + customer + "'";
    db.query(userQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else {
        let delQuery =
          " Select * from Delivery_person where emp_ID = (Select del_person from Orders where order_ID = '" +
          order +
          "')";
        db.query(delQuery, (err, ans) => {
          if (err) {
            rres.render("login-user.ejs", {
              message: "Oops! An error occurred",
              title: "Welcome to EatRepeat - Sign In"
            });
          }
          res.render("payment.ejs", {
            items: finalItems,
            customerDetails: result,
            totalPayment: totprice,
            deliveryPerson: ans,
            title: "Welcome to EatRepeat | Order Confirmed"
          });
        });
      }
    });
  },
  cancelOrder: (req, res) => {
    let cancelQuery =
      "Delete FROM order_contains_item WHERE order_id = '" + order + "'";
    db.query(cancelQuery, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      } else {
        let cancelQuery2 =
          "Delete FROM Orders WHERE order_ID = '" + order + "'";
        db.query(cancelQuery2, (err, result) => {
          if (err) {
            res.render("login-user.ejs", {
              message: "Oops! An error occurred",
              title: "Welcome to EatRepeat - Sign In"
            });
          } else {
            res.redirect("/restaurants");
          }
        });
      }
    });
  }
};
