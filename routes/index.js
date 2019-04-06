module.exports = {
  getHomePage: (req, res) => {
    let query = "CALL allRestaurants()"; // query database to get all the players

    // execute query
    db.query(query, (err, result) => {
      if (err) {
        res.redirect("/");
      }
      res.render("homepage.ejs", {
        restaurants: result[0],
        title: "Welcome to Socka | View Players"
      });
    });
  }
};
