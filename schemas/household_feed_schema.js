const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const householdFeedSchema = new Schema(
  {
    adminID: { type: String, require: true },
    img: { type: String, require: true },
    chore_name: { type: String, require: true },
    chore_id: { type: String, require: true },
    username: { type: String, require: true },
    time: { type: String, require: true },
    date: { type: Date, require: true },
    userID: { type: String, require: true },
    points: { type: Number, require: true },
    household: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = householdFeedSchema;
