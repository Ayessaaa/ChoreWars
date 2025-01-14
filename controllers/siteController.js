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
const choresTodaySchema = require("../schemas/chores_today_schema");

const updateChoresToday = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = new Date();


  if (isLoggedIn) {
    User.find({ username: req.session.username }).then(async (result) => {
      if (!req.session.admin) {
        const householdMember = await mongoose.model(
          "household_" + result[0].household_name + "_member",
          householdMemberSchema
        );

        const householdChore = await mongoose.model(
          "household_" + result[0].household_name + "_chore",
          householdChoreSchema
        );

        const choresToday = await mongoose.model(
          "today_" +
            result[0].household_name +
            "_" +
            req.session.username +
            "_chore",
          choresTodaySchema
        );

        await householdMember
          .find({ username: req.session.username })
          .then(async (resultMember) => {
            console.log(resultMember);
            // for every chore the member has
            for (let i = 0; i < resultMember[0].choresID.length; i++) {
              const choreID = resultMember[0].choresID[i];
              console.log("look");
              // look through the library of chores
              await householdChore.find({ _id: choreID }).then(async (resultChore) => {
                console.log(resultChore);
                // check if the type is daily
                if (resultChore[0].frequency === "daily") {
                  // check if its today chores already created
                  console.log("daily");
                  await choresToday
                    .find({
                      choreID: choreID,
                      date: new Date().toISOString().split("T")[0],
                    })
                    .then(async (resultChoreToday) => {
                      console.log(resultChoreToday);
                      if (resultChoreToday.length <= 0) {
                        console.log("less than 0");
                        const createChoreToday = new choresToday({
                          username: req.session.username,
                          chore_name: resultChore[0].chore_name,
                          choreID: resultChore[0]._id,
                          date: new Date().toISOString().split("T")[0],
                          points: resultChore[0].points,
                          frequency: resultChore[0].frequency,
                          done: false,
                          participants: resultChore[0].participants,
                        });

                        await createChoreToday.save();
                      }
                    });
                } else if (
                  resultChore[0].frequency === dayNames[today.getDay()]
                ) {
                  console.log(resultChore[0].frequency);
                  await choresToday
                    .find({
                      choreID: choreID,
                      date: new Date().toISOString().split("T")[0],
                    })
                    .then(async (resultChoreToday) => {
                      console.log(resultChoreToday);
                      if (resultChoreToday.length <= 0) {
                        console.log("less than 0");
                        const createChoreToday = new choresToday({
                          username: req.session.username,
                          chore_name: resultChore[0].chore_name,
                          choreID: resultChore[0]._id,
                          date: new Date().toISOString().split("T")[0],
                          points: resultChore[0].points,
                          frequency: resultChore[0].frequency,
                          done: false,
                          participants: resultChore[0].participants,
                        });

                        await createChoreToday.save();
                      }
                    });
                }
              });
            }
          })
          .catch((err) => console.log(err));
      }
      res.redirect("/home");
    });
  } else {
    res.redirect("/log-in");
  }
};

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

          const householdChore = mongoose.model(
            "household_" + result[0].household_name + "_chore",
            householdChoreSchema
          );

          householdMember
            .find()
            .then((resultMember) => {
              householdChore.find().then((resultChore) => {
                res.render("admin", {
                  username: req.session.username,
                  household_name: result[0].household_name,
                  members: resultMember,
                  chores: resultChore,
                });
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        User.find({ username: req.session.username }).then((result) => {
          const choresToday = mongoose.model(
            "today_" +
              result[0].household_name +
              "_" +
              req.session.username +
              "_chore",
            choresTodaySchema
          );

          const householdFeed = mongoose.model(
            "household_" + result[0].household_name + "_feed",
            householdFeedSchema
          );

          const householdMember = mongoose.model(
            "household_" + result[0].household_name + "_member",
            householdMemberSchema
          );

          choresToday
            .find({ done: false })
            .sort({ date: "asc" })
            .then((resultChore) => {
              householdFeed.find().then((resultFeed) => {
                householdMember
                  .find()
                  .sort({ points: "desc" })
                  .then((resultMember) => {
                    res.render("home", {
                      username: req.session.username,
                      chores: resultChore,
                      feeds: resultFeed,
                      members: resultMember,
                    });
                  });
              });
            })
            .catch((err) => console.log(err));
        });
      }
    });
  } else {
    res.redirect("log-in");
  }
};

const createHousehold = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    res.render("createHousehold", { username: req.session.username });
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
    await householdMember.createCollection().catch((err) => console.log(err));

    const householdChore = mongoose.model(
      "household_" + req.body.household + "_chore",
      householdChoreSchema
    );
    await householdChore.createCollection().catch((err) => console.log(err));

    const householdFeed = mongoose.model(
      "household_" + req.body.household + "_feed",
      householdFeedSchema
    );
    await householdFeed.createCollection().catch((err) => console.log(err));

    await User.findOneAndUpdate(
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
      if (
        Object.values(req.body)[i].toLowerCase() === "" ||
        Object.values(req.body)[i + 1] === ""
      ) {
      } else {
        const member = new householdMember({
          username: Object.values(req.body)[i].toLowerCase(),
          fullname: Object.values(req.body)[i + 1],
          household: req.body.household,
        });

        await member.save();
      }
    }

    res.redirect("/home");
  } else {
    res.redirect("/log-in");
  }
};

const joinLink = (req, res) => {

      const householdMember = mongoose.model(
        "household_" + req.params.household + "_member",
        householdMemberSchema
      );
      householdMember
        .find({ _id: req.params.id })
        .then((resultMember) => {
          res.render("joinLink", {
            household_name: req.params.household,
            member: resultMember[0],
          });
        })
        .catch((err) => {
          console.log(err);
        });
  
};

const joinLinkPost = async (req, res) => {
  let hashedPassword = await bcrypt.hash(req.body.password, 8);

  var path = "https://fl-1.cdn.flockler.com/embed/no-image.svg";

  try {
    path = req.file.path;
  } catch {
    path = "https://fl-1.cdn.flockler.com/embed/no-image.svg";
  }

    const householdMember = mongoose.model(
      "household_" + req.params.household + "_member",
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
      household_name: req.params.household,
    });

    user.save();

    const choresToday = mongoose.model(
      "today_" +
        req.params.household +
        "_" +
        req.body.username.toLowerCase() +
        "_chore",
      choresTodaySchema
    );
    choresToday.createCollection().catch((err) => console.log(err));

    res.redirect("/log-in");
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
    User.find({ username: req.session.username }).then(async (result) => {
      const householdChore = mongoose.model(
        "household_" + result[0].household_name + "_chore",
        householdChoreSchema
      );

      console.log(req.body);

      let participantsArray = [];
      let participantsIDs = [];

      for (let i = 3; i < Object.keys(req.body).length; i++) {
        const element = Object.keys(req.body)[i];
        participantsArray.push(element.split("-")[0]);
        participantsIDs.push(element.split("-")[1]);

      console.log(element.split("-")[0])

      }

      const chore = new householdChore({
        chore_name: req.body.chore,
        frequency: req.body.frequency,
        points: req.body.points,
        type: req.body.chore_type,
        participants: participantsArray,
        participantsID: participantsIDs,
      });

      const choreSave = await chore.save();

      const householdMember = mongoose.model(
        "household_" + result[0].household_name + "_member",
        householdMemberSchema
      );

      for (let i = 3; i < Object.keys(req.body).length; i++) {
        const element = Object.keys(req.body)[i];
        participantsArray.push(element.split("-")[0]);
        participantsIDs.push(element.split("-")[1]);

        const member = await householdMember.findOneAndUpdate(
          { _id: element.split("-")[1] },
          {
            $push: { choresID: choreSave._id },
          }
        );
      }

      res.redirect("/home");
    });
  } else {
    res.redirect("/log-in");
  }
};

const addMember = (req, res) => {
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
          res.render("addMember", {
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

const addMemberPost = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then((result) => {
      const householdMember = mongoose.model(
        "household_" + result[0].household_name + "_member",
        householdMemberSchema
      );

      const member = new householdMember({
        household: result[0].household_name,
        username: req.body.username,
        fullname: req.body.fullname,
      });

      member.save();

      res.redirect("/members");
    });
  } else {
    res.redirect("/log-in");
  }
};

const choreDone = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then((result) => {
      const choresToday = mongoose.model(
        "today_" +
          result[0].household_name +
          "_" +
          req.session.username +
          "_chore",
        choresTodaySchema
      );

      const today = new Date();
      console.log(today.getHours());

      let hour = today.getHours();
      let am_pm = "AM";

      if (today.getHours() > 12) {
        hour = today.getHours() - 12;
      }

      if (today.getHours() >= 12 && today.getHours() <= 23) {
        let am_pm = "PM";
      }

      choresToday.find({ _id: req.params.id }).then((resultChore) => {
        res.render("choreDone", {
          chore: resultChore[0],
          username: req.session.username,
          time: hour + ":" + today.getMinutes() + " " + am_pm,
          date:
            today.toString().split(" ")[1] +
            " " +
            today.toString().split(" ")[2],
        });
      });
    });
  } else {
    res.redirect("/log-in");
  }
};

const choreDonePost = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    var path = "https://fl-1.cdn.flockler.com/embed/no-image.svg";

    try {
      path = req.file.path;
    } catch {
      path = "https://fl-1.cdn.flockler.com/embed/no-image.svg";
    }
    User.find({ username: req.session.username }).then(async (result) => {
      const householdFeed = mongoose.model(
        "household_" + result[0].household_name + "_feed",
        householdFeedSchema
      );

      const householdMember = mongoose.model(
        "household_" + result[0].household_name + "_member",
        householdMemberSchema
      );

      const choresToday = mongoose.model(
        "today_" +
          result[0].household_name +
          "_" +
          req.session.username +
          "_chore",
        choresTodaySchema
      );

      choresToday.find({ _id: req.params.id }).then(async (result) => {
        await householdMember.findOneAndUpdate(
          { username: req.session.username },
          { $inc: { points: result[0].points } }
        );
        console.log(result[0].points);
      });

      await choresToday
        .findOneAndUpdate({ _id: req.params.id }, { done: true })
        .then((result) => {})
        .catch((err) => {
          console.log(err);
        });

      const today = new Date();
      console.log(today.getHours());

      let hour = today.getHours();
      let am_pm = "AM";

      if (today.getHours() > 12) {
        hour = today.getHours() - 12;
      }

      if (today.getHours() >= 12 && today.getHours() <= 23) {
        let am_pm = "PM";
      }

      choresToday.find({ _id: req.params.id }).then((resultChore) => {
        const feed = new householdFeed({
          img: path,
          chore_name: resultChore[0].chore_name,
          choreID: resultChore[0].choreID,
          username: req.session.username,
          time: hour + ":" + today.getMinutes() + " " + am_pm,
          date: today,
          userID: result[0]._id,
          points: resultChore[0].points,
          household: result[0].household_name,
        });

        feed.save();

        res.redirect("/home");
      });
    });
  } else {
    res.redirect("/log-in");
  }
};

const choreFeed = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then(async (result) => {
      const householdFeed = mongoose.model(
        "household_" + result[0].household_name + "_feed",
        householdFeedSchema
      );
      householdFeed.find().then((result) => {
        res.render("choreFeed", { feeds: result });
      });
    });
  } else {
    res.redirect("/log-in");
  }
};

const leaderboard = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then((result) => {
      const householdMember = mongoose.model(
        "household_" + result[0].household_name + "_member",
        householdMemberSchema
      );

      householdMember
        .find()
        .sort({ points: "desc" })
        .then((resultMember) => {
          res.render("leaderboard", { members: resultMember });
        });
    });
  } else {
    res.redirect("/log-in");
  }
};

const chores = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then((result) => {
      if (!req.session.admin) {
        const choresToday = mongoose.model(
          "today_" +
            result[0].household_name +
            "_" +
            req.session.username +
            "_chore",
          choresTodaySchema
        );

        choresToday
          .find({ done: false })
          .sort({ date: "asc" })
          .then((resultChores) => {
            res.render("chores", { chores: resultChores });
          });
      } else {
        const householdChore = mongoose.model(
          "household_" + result[0].household_name + "_chore",
          householdChoreSchema
        );

        householdChore.find().then((resultChores) => {
          res.render("choresAdmin", { chores: resultChores });
        });
      }
    });
  } else {
    res.redirect("/log-in");
  }
};

const editChore = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn && req.session.admin) {
    User.find({ username: req.session.username }).then((result) => {
      const householdChore = mongoose.model(
        "household_" + result[0].household_name + "_chore",
        householdChoreSchema
      );

      const householdMember = mongoose.model(
        "household_" + result[0].household_name + "_member",
        householdMemberSchema
      );

      householdChore.find({ _id: req.params.id }).then((resultChore) => {
        householdMember.find().then((resultMember) => {
          res.render("editChore", {
            chore: resultChore[0],
            household_name: result[0].household_name,
            members: resultMember,
          });
        });
      });
    });
  } else {
    res.redirect("/log-in");
  }
};

const editChorePost = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn && req.session.admin) {
    User.find({ username: req.session.username }).then((result) => {
      const householdChore = mongoose.model(
        "household_" + result[0].household_name + "_chore",
        householdChoreSchema
      );

      let participantsArray = [];
      let participantsIDs = [];

      for (let i = 3; i < Object.keys(req.body).length; i++) {
        const element = Object.keys(req.body)[i];
        participantsArray.push(element.split("-")[0]);
        participantsIDs.push(element.split("-")[1]);
      }
      console.log(req.body);

      householdChore
        .findOneAndUpdate(
          { _id: req.params.id },
          {
            chore_name: req.body.chore,
            frequency: req.body.frequency,
            points: req.body.points,
            participants: participantsArray,
            participantsID: participantsIDs,
          },
          { new: true }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      res.redirect("/chores");
    });
  } else {
    res.redirect("/log-in");
  }
};

const deleteChore = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn && req.session.admin) {
    User.find({ username: req.session.username }).then(async (result) => {
      const householdChore = mongoose.model(
        "household_" + result[0].household_name + "_chore",
        householdChoreSchema
      );

      await householdChore.findOneAndDelete({ _id: req.params.id });

      res.redirect("/chores");
    });
  } else {
    res.redirect("/log-in");
  }
};

const members = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    if (req.session.admin) {
      User.find({ username: req.session.username }).then(async (result) => {
        const householdMember = mongoose.model(
          "household_" + result[0].household_name + "_member",
          householdMemberSchema
        );

        householdMember.find().then((result) => {
          res.render("members", { members: result });
        });
      });
    } else {
      User.find({ username: req.session.username }).then(async (result) => {
        const householdMember = mongoose.model(
          "household_" + result[0].household_name + "_member",
          householdMemberSchema
        );

        householdMember
          .find({ username: req.session.username })
          .then((result) => {
            res.render("profile", { member: result[0] });
          });
      });
    }
  } else {
    res.redirect("/log-in");
  }
};

const deleteMember = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
    User.find({ username: req.session.username }).then(async (result) => {
      const householdMember = mongoose.model(
        "household_" + result[0].household_name + "_member",
        householdMemberSchema
      );

      await householdMember.findOneAndDelete({ _id: req.params.id });

      res.redirect("/members");
    });
  } else {
    res.redirect("/log-in");
  }
};

const profilePost = (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;

  if (isLoggedIn) {
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
        { username: req.session.username },
        { fullname: req.body.fullname, img: path }
      );
    });
    res.redirect("/home");
  } else {
    res.redirect("/log-in");
  }
};

const guide = (req, res)=>{
  res.render("guide")
}

module.exports = {
  home,
  createHousehold,
  createHouseholdPost,
  joinLink,
  joinLinkPost,
  addChore,
  addChorePost,
  addMember,
  addMemberPost,
  updateChoresToday,
  choreDone,
  choreDonePost,
  choreFeed,
  leaderboard,
  chores,
  editChore,
  editChorePost,
  deleteChore,
  members,
  deleteMember,
  profilePost,
  guide
};
