const express = require("express");
const serverless = require("serverless-http");
const LegoData = require("../modules/legoSets");
const sequelize = require("../modules/sequelize");
const path = require("path");
require("dotenv").config(); 

const app = express();
const legoData = new LegoData();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
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
      const setNum = req.params.set_num;
      console.log("Requested Set Number:", setNum);
    
      legoData.getSetByNum(setNum)
        .then(set => {
          if (!set) {
            console.log(`No set found with set_num: ${setNum}`); 
            return res.status(404).render("404", { message: "Set not found" });
          }
          console.log("Found Set:", set);
          res.render("set", { set });
        })
        .catch(err => {
          console.error("Error retrieving set:", err);
          res.status(500).send("Server error: " + err.message);
        });
    });

    app.get("/lego/sets/search", (req, res) => {
      const theme = req.query.theme;
      console.log("Searching for theme:", theme);
      legoData.getSetsByTheme(theme)
        .then(sets => {
          res.render("sets", { sets });
        })
        .catch(err => {
          res.status(500).send("Error: " + err);
        });
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

  })
  .catch((err) => {
    console.error("❌ Failed to connect or initialize:", err);
  });

module.exports = app;
module.exports.handler = serverless(app);
