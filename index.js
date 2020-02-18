const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const hbs = exphbs.create({
  /* config */
});

const notes = require("./routes/notes");
const users = require("./routes/users");

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose
  .connect("mongodb://localhost/notes-dev", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected.");
  })
  .catch(err => console.log(err));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// override with the X-HTTP-Method-Override header in the request
// app.use(methodOverride("X-HTTP-Method-Override"));

// EXPRESS SESSION MIDDLEWARE
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Handlebars Middleware
// Register `hbs.engine` with the Express app.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  //res.send("Hello World");
  console.log(req.params.id);
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

//Use Notes routes
app.use("/notes", notes);

//Use Notes routes
app.use("/users", users);

app.listen(port, () => {
  console.log(`App is available on http://localhost:${port}`);
});
