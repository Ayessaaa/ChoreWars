const { render } = require("ejs");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const User = require("../models/user");

const householdMemberSchema = require("../schemas/household_member_schema");
const householdChoreSchema = require("../schemas/household_chore_schema");
const householdFeedSchema = require("../schemas/household_feed_schema");

const home = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then((result) => {
      if (result[0].admin) {
        console.log(result[0].household_name);
        if (result[0].household_name === undefined) {
          res.redirect("/create-household");
        } else {
          res.render("admin");
        }
      } else {
        res.render("home");
      }
    });
  } else {
    res.redirect("log-in");
  }
};

const createHousehold = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    res.render("createHousehold");
  } else {
    res.redirect("/log-in");
  }
};

const createHouseholdPost = async (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    
    const householdMember = mongoose.model(
      "household_" + req.body.household + "_member",
      householdMemberSchema
    );
    householdMember.createCollection().catch((err) => console.log(err));

    const householdChore = mongoose.model(
      "household_" + req.body.household + "_chore",
      householdChoreSchema
    );
    householdChore.createCollection().catch((err) => console.log(err));

    const householdFeed = mongoose.model(
      "household_" + req.body.household + "_feed",
      householdFeedSchema
    );
    householdFeed.createCollection().catch((err) => console.log(err));

    User.findOneAndUpdate(
      { username: req.session.username },
      { household_name: req.body.household }
    )
      .then((result) => {
        console.log("User household updated");
      })
      .catch((err) => {
        console.log(err);
      });

    let member = new householdMember({
      username: req.session.username,
      household: req.body.household,
    });

    await member.save();

    res.redirect("/home");
  } else {
    res.redirect("/log-in");
  }
};

module.exports = {
  home,
  createHousehold,
  createHouseholdPost,
};
