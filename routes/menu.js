const fs = require("fs");

module.exports = {
  showMenu: (req, res) => {
    let restId = req.params.id;
    //let menuQuery = 'Select * from Item JOIN (Select * from Item_in_restaurant where rest_ID='+restId+') as R on Item.item_ID = R.item_ID';
    let menuQuery = "call showMenu(?)";
    db.query(menuQuery, restId, (err, result) => {
      if (err) {
        res.render("login-user.ejs", {
          message: "Oops! An error occurred",
          title: "Welcome to EatRepeat - Sign In"
        });
      }
      restaurant = restId;
      res.render("show-menu.ejs", {
        title: "MENU:",
        restaurant: result[0]
      });
    });
  }
};
