module.exports = {
  getHomePage: (req, res) => {
    res.render("homepage.ejs", {
      title: "Welcome to EatRepeat"
    });
  },
  getRestaurants: (req, res) => {
    let query = "CALL allRestaurants()";
    db.query(query, (err, result) => {
      if (err) {
        res.redirect("/");
      }
      res.render("index.ejs", {
        restaurants: result[0],
        title: "Welcome to EatRepeat | View Restaurants"
      });
    });
  },
  getOrdersPage: (req, res) => {
    let query = "call getOrders(?)";
    db.query(query, customer, (err, result) => {
      if (err) {
        res.redirect("/");
      }
      res.render("view-orders.ejs", {
        orders: result[0],
        title: "Welcome to EatRepeat | View Orders"
      });
    });
  }
};
