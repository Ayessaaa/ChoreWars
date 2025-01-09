const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const householdMemberSchema = new Schema(
  {
    adminID: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: false },
    fullname: { type: String, require: false },
    points: { type: Number, require: false },
    chores: { type: Array, require: false },
    choresID: { type: Array, require: false },
    img: { type: String, require: false },
    household: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = householdMemberSchema;
