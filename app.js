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
const subscriberRouter = require("./routes/subscriber");
const publisherRouter = require("./routes/publisher");

// middlewares
// FIXME: Si pas loggué, redirige vers la page de login
// app.use(function(req, res, next) {
//   try {
//     console.log(req.session.user)
//     if(req.session.user) {
//       res.render("pages/home");
//     } else {
//       res.render('pages/login');
//     }
//   } catch (error) {
//     next(error);
//   }
// });

app.get('/getSessionData', function(req, res) {
  res.json(req.session);
});

app.get("/", (req, res) => {
  console.log(req.session.user)
  res.render("pages/home");
});

app.get('/checkUser', userController.checkUser);

app.use("/home", homeRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/subscriber", subscriberRouter);
app.use("/publisher", publisherRouter);

app.listen(port, () => {
  console.log(`Forum app started at http://localhost:${port}`);
});
