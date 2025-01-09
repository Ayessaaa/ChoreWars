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

const HouseholdChore = mongoose.model("HouseholdChore", householdChoreSchema);

const home = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then((result) => {
      if (result[0].admin) {
        console.log(result[0].household_name);
        if (result[0].household_name === undefined) {
          res.redirect("/create-household");
        } else {
          const householdMember = mongoose.model(
            "household_" + result[0].household_name + "_member",
            householdMemberSchema
          );
          householdMember
            .find()
            .then((resultMember) => {
              res.render("admin", {
                household_name: result[0].household_name,
                member: resultMember,
              });
            })
            .catch((err) => {
              console.log(err);
            });
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

    for (let i = 1; i < Object.values(req.body).length; i += 2) {
      const member = new householdMember({
        username: Object.values(req.body)[i].toLowerCase(),
        fullname: Object.values(req.body)[i + 1],
        household: req.body.household,
      });

      await member.save();
    }

    res.redirect("/home");
  } else {
    res.redirect("/log-in");
  }
};

const joinLink = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then((result) => {
      const householdMember = mongoose.model(
        "household_" + result[0].household_name + "_member",
        householdMemberSchema
      );
      householdMember
        .find({ _id: req.params.id })
        .then((resultMember) => {
          res.render("joinLink", {
            household_name: result[0].household_name,
            member: resultMember[0],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    res.redirect("/log-in");
  }
};

const joinLinkPost = async (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  let hashedPassword = await bcrypt.hash(req.body.password, 8);

  var path = "https://fl-1.cdn.flockler.com/embed/no-image.svg";

  try {
    path = req.file.path;
  } catch {
    path = "https://fl-1.cdn.flockler.com/embed/no-image.svg";
  }

  User.find({ username: req.session.username }).then(async (result) => {
    const householdMember = mongoose.model(
      "household_" + result[0].household_name + "_member",
      householdMemberSchema
    );
    await householdMember.findOneAndUpdate(
      { _id: req.params.id },
      {
        username: req.body.username.toLowerCase(),
        password: hashedPassword,
        fullname: req.body.fullname,
        img: path,
      }
    );

    const user = new User({
      username: req.body.username.toLowerCase(),
      password: hashedPassword,
      household_name: result[0].household_name,
    });

    user.save();
    res.redirect("/log-in");
  });
};

const addChore = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then((result) => {
      const householdMember = mongoose.model(
        "household_" + result[0].household_name + "_member",
        householdMemberSchema
      );
      householdMember
        .find({})
        .then((resultMember) => {
          res.render("addChore", {
            household_name: result[0].household_name,
            members: resultMember,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    res.redirect("/log-in");
  }
};

const addChorePost = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then((result) => {

      const householdChore = mongoose.model(
        "household_" + result[0].household_name + "_chore",
        householdChoreSchema
      );

      console.log(req.body);

      let participantsArray = []

      for (let i = 4; i < Object.keys(req.body).length; i++) {
        const element = Object.keys(req.body)[i];
        participantsArray.push(element.split("-")[0])
      }

      const chore =  new householdChore({
        chore_name: req.body.chore,
        frequency: req.body.frequency,
        points: req.body.points,
        type: req.body.chore_type,
        participants: participantsArray
      })

      chore.save()


      res.redirect("/home")

    });
  } else {
    res.redirect("/log-in");
  }
};

module.exports = {
  home,
  createHousehold,
  createHouseholdPost,
  joinLink,
  joinLinkPost,
  addChore,
  addChorePost,
};
