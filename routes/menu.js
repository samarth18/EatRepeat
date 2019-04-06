const fs = require("fs");

module.exports = {
	showMenu: (req, res) => {
		let restId = req.params.id
		//let menuQuery = 'Select * from Item JOIN (Select * from Item_in_restaurant where rest_ID='+restId+') as R on Item.item_ID = R.item_ID';
    let menuQuery = 'call showMenu(?)';

		db.query(menuQuery, restId, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      console.log(
      result[0]);
      res.render("show-menu.ejs", {
        title: "MENU:",
        restaurant: result[0]
      });

    });
	}
	};