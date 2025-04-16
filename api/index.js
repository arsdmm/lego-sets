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

let dbInitialized = false;

app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await sequelize.authenticate();
      await legoData.initialize();
      console.log("✅ DB connected inside middleware");
      dbInitialized = true;
    } catch (err) {
      console.error("❌ DB init error:", err);
      return res.status(500).send("Failed to initialize database");
    }
  }
  next();
});

app.get("/", (req, res) => {
    try {
      console.log("📍 GET / called");
      res.render("home");
    } catch (err) {
      console.error("❌ Error rendering home:", err);
      res.status(500).send("Error rendering home page");
    }
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
  legoData.getSetByNum(setNum)
    .then(set => {
      if (!set) return res.status(404).render("404", { message: "Set not found" });
      res.render("set", { set });
    })
    .catch(err => res.status(500).send("Server error: " + err.message));
});

app.get("/lego/sets/search", (req, res) => {
  const theme = req.query.theme;
  legoData.getSetsByTheme(theme)
    .then(sets => res.render("sets", { sets }))
    .catch(err => res.status(500).send("Error: " + err));
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

module.exports = app;
module.exports.handler = serverless(app);
