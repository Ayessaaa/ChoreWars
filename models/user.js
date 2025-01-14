const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, require: true },
    password: { type: String, require: true },
    admin: { type: Boolean, require: true, default: false },
    household_name: { type: String, require: false},
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
