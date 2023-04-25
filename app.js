require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;

// Fichiers statiques
app.use(express.static("public"));
app.use("/assets", express.static("public"));

// template view engine, dans ce cas EJS
app.set("view engine", "ejs");

// Pour les req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
const subscriberRouter = require("./routes/subscriber");
const publisherRouter = require("./routes/publisher");

app.get("/", (req, res) => {
  res.send("Bienvenue sur le forum de discussions!");
});

app.use("/subscriber", subscriberRouter);
app.use("/publisher", publisherRouter);

app.listen(port, () => {
  console.log(`Example app started at http://localhost:${port}`);
});
