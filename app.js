require('dotenv').config();
const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const userController = require('./controllers/user');

const app = express();
const port = 3000;

// Fichiers statiques
app.use(express.static("public"));
app.use("/assets", express.static("public"));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 12 * 60 * 60 * 1000 } // 12 heures en millisecondes pour détruire la session
  })
);

// Connexion à la base de données
const { connectToDb } = require('./service/dbService');
(async () => { await connectToDb(); })();

// template view engine, dans ce cas EJS
app.set("view engine", "ejs");

// Pour les req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
const homeRouter = require("./routes/home");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const chatRouter = require("./routes/chat");

app.get('/getSessionData', function(req, res) {
  res.json(req.session);
});

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.render("pages/home");
});

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get('/checkUser', userController.checkUser);
app.get('/getAllUsers', userController.getAllUsers);

app.use("/home", homeRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/chat", chatRouter);

app.listen(port, () => {
  console.log(`Forum app started at http://localhost:${port}`);
});
