//.env
require("dotenv").config(require("path").join(__dirname, "../"));

//modules/libraries
const express = require('express');
const zerouth = require('0uth');

const app = express();
const passport = require("passport");
const authRoute = require("./auth/auth");

app.use(express.urlencoded({ extended: true }))
app.use(require("express-session")({ secret: 'SECRET' , resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())

app.set("view engine", "ejs");
app.use("/", authRoute);

app.get('/', require("../middleware/auth"), (req:any, res:any) => {
    console.log(req.user)
    res.render("Dashboard", {user: req.user})
});

app.get("/login", (req:any, res:any) => {
    res.render("Login", {proxy: "http://localhost:3000"});
})

app.listen(process.env.PORT || 3000, () => {
    console.log("live!")
});