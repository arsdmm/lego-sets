const express = require("express");
const LegoData = require("./modules/legoSets");
const sequelize = require("./modules/sequelize");
const path = require("path");
require("dotenv").config(); 

const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const legoData = new LegoData();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connection established!");
    return legoData.initialize(); 
  })
  .then(() => {

    app.get("/", (req, res) => {
      res.render("home");
    });

    app.get("/about", (req, res) => {
      res.render("about");
    });

    app.get("/lego/sets", (req, res) => {
      legoData.getAllSets()
        .then(sets => res.render("sets", { sets }))
        .catch(err => res.status(500).send(err));
    });

    app.get("/lego/sets/:set_num", (req, res) => {
      legoData.getSetByNum(req.params.set_num)
        .then(set => res.render("set", { set }))
        .catch(() => res.status(404).send("Set not found"));
    });

    app.get("/lego/addSet", async (req, res) => {
        try {
          const themes = await legoData.getAllThemes();
          res.render("addSet", { themes });
        } catch (err) {
          res.status(500).send("Error fetching themes");
        }
      });
      

    app.post("/lego/addSet", async (req, res) => {
      try {
        const foundTheme = await legoData.getThemeById(req.body.theme_id);
        req.body.theme = foundTheme.name;
        await legoData.addSet(req.body);
        res.redirect("/lego/sets");
      } catch (err) {
        res.status(500).send("Server error: " + err.message);
      }
    });

    app.use((req, res) => {
      res.status(404).render("404");
    });

    app.listen(HTTP_PORT, () => {
      console.log(`🚀 Server running on port ${HTTP_PORT}`);
    });

  })
  .catch((err) => {
    console.error("❌ Failed to connect or initialize:", err);
  });
