/********************************************************************************
* WEB700 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Dmytro Litvinov Student ID: 132258237 Date: 1/31/2025
*
* Published URL: https://assignment3web.vercel.app/
*
********************************************************************************/
const express = require("express");
const LegoData = require("./modules/legoSets");
const path = require("path");

const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const legoData = new LegoData();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

legoData.initialize()
    .then(() => {

        app.get("/", (req, res) => {
            res.render(path.join(__dirname, "views", "home.ejs"));
        });

        app.get("/about", (req, res) => {
            res.render(path.join(__dirname, "views", "about.ejs"));
        });

        app.get("/lego/sets", (req, res) => {
            legoData.getAllSets()
              .then(sets => {
              res.render("sets", {sets : sets});
            })
              .catch(err => res.status(500).send(err))
        });

        app.get("/lego/sets/:set_num", (req, res) => {
            legoData.getSetByNum(req.params.set_num)
                .then(set => {
                    res.render("set", { set: set });
                })
                .catch(err => {
                    res.status(404).send("Set not found");
                });
        });

        app.get("/lego/addSet", async (req, res) => {
          try {
              const themes = await legoData.getAllThemes();
              res.render("addSet", { themes: themes });
          } catch (err) {
              console.error("Error fetching themes:", err);
              res.status(500).send("Error fetching themes: " + err.message);
          }
      });
      
      

      app.post("/lego/addSet", async (req, res) => {
        console.log("⚡ Новый POST-запрос на /lego/addSet");
    
        try {
            console.log("📦(req.body):", req.body);
    
            if (!req.body) {
                console.error("❌ req.body is NULL or undefined!");
            } 
    
            if (!req.body.theme_id) {
                console.error("❌Error: theme_id missing в req.body!", req.body);
                throw new Error("Missing theme_id in request body");
            }
    
            let foundTheme = await legoData.getThemeById(req.body.theme_id);
            req.body.theme = foundTheme.name;
    
            await legoData.addSet(req.body); 
            res.redirect("/lego/sets");
        } catch (err) {
            console.error("❌ Server Error:", err);
            res.status(500).send("Server error: " + (err.message || "Unknown error"));
        }
    });
    
        app.use((req, res) => {
            res.status(404).render(path.join(__dirname, "views", "404.ejs"));
        });


        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize Lego data:", err);
    });

app.use(express.json());
