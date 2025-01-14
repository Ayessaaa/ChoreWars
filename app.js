require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const cloudinary = require("cloudinary").v2;

const { storage } = require("./storage/storage");
const multer = require("multer");
const upload = multer({ storage });

const { render } = require("ejs");
dotenv.config({ path: ".env" });

const authController = require("./controllers/authController");
const siteController = require("./controllers/siteController");

const app = express();

app.set("view engine", "ejs");

const dbURI = process.env.DB_URI;
if (!dbURI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/sign-up", authController.signUp);

app.get("/sign-up/:err", authController.signUpError);

app.get("/log-in", authController.logIn);

app.get("/log-in/:err", authController.logInError);

app.post("/auth/sign-up", authController.authSignUp);

app.post("/auth/log-in", authController.authLogIn);

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/log-in");
    }
  });
});

app.get("/", (req, res) => {
  res.redirect("home");
});

app.get("/home", siteController.home);

app.get("/create-household", siteController.createHousehold);
app.post("/create-household", siteController.createHouseholdPost);

app.get("/join-link/:id/:household", siteController.joinLink);
app.post("/join-link/:id/:household", upload.single("image"), siteController.joinLinkPost);

app.get("/add-chore", siteController.addChore);
app.post("/add-chore", siteController.addChorePost);

app.get("/add-member", siteController.addMember);
app.post("/add-member", siteController.addMemberPost);

app.get("/update_chores_today", siteController.updateChoresToday);

app.get("/chore-done/:id", siteController.choreDone);
app.post("/chore-done/:id", upload.single("image"), siteController.choreDonePost);

app.get("/chore-feed", siteController.choreFeed)

app.get("/leaderboard", siteController.leaderboard)

app.get("/chores", siteController.chores)

app.get("/edit-chore/:id", siteController.editChore)
app.post("/edit-chore/:id", siteController.editChorePost)

app.get("/delete-chore/:id", siteController.deleteChore)

app.get("/members", siteController.members)

app.get("/delete-member/:id", siteController.deleteMember)

app.post("/profile/:id", upload.single("image"), siteController.profilePost)

app.get("/guide", siteController.guide)