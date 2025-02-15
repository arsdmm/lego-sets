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

app.use(express.static("public"));

legoData.initialize()
    .then(() => {
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "home.html"));
        });

        app.get("/about", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "about.html"));
        });

        app.get("/lego/sets", (req, res) => {
            const theme = req.query.theme;
            if (theme) {
                legoData.getSetsByTheme(theme)
                    .then(sets => res.json(sets))
                    .catch(err => res.status(404).json({ error: err }));
            } else {
                legoData.getAllSets()
                    .then(sets => res.json(sets))
                    .catch(err => res.status(404).json({ error: err }));
            }
        });

        app.get("/lego/sets/:set_num", (req, res) => {
            legoData.getSetByNum(req.params.set_num)
                .then(set => res.json(set))
                .catch(err => res.status(404).json({ error: err }));
        });

        app.use((req, res) => {
            res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
        });

        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize Lego data:", err);
    });