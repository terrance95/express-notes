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

///Load Idea Model
require("./models/Idea");
const Idea = mongoose.model("ideas");

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

//Process Form
app.post("/ideas", (req, res) => {
  let errors = [];
  console.log(req.body);
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }

  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    //res.send("Success");
    const newUser = {
      title: req.body.title,
      detail: req.body.details
    };
    new Idea(newUser).save().then(() => {
      req.flash("success_msg", "Note added");
      res.redirect("/ideas");
    });
  }
});

app.get("/ideas", (req, res) => {
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      console.log(ideas);
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// Add Idea Form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

// Edit Idea Form
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    console.log(idea);
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

// Delete Idea
app.delete("/ideas/:id", (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Note removed");
    res.redirect("/ideas");
  });
});

//Edit form process
app.put("/ideas/:id", (req, res) => {
  res.send("PUT");
  console.log("sure");
});

app.listen(port, () => {
  console.log(`App is available on http://localhost:${port}`);
});
