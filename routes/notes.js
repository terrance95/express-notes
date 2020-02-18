const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

///Load Idea Model
require("../models/Idea");
const Idea = mongoose.model("ideas");

//Process Form
router.post("/", (req, res) => {
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
      res.redirect("/notes");
    });
  }
});

router.get("/", (req, res) => {
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
router.get("/add", (req, res) => {
  res.render("ideas/add");
});

// Edit Idea Form
router.get("/edit/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Note removed");
    res.redirect("/notes");
  });
});

//Edit form process
// router.put("/:id", (req, res) => {
//   res.send("PUT");
// });

module.exports = router;
