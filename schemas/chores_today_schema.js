const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const choreTodaySchema = new Schema(
  {
    adminID: { type: String, require: true },
    username: { type: String, require: true },
    chore_name: { type: String, require: true },
    choreID: { type: String, require: true },
    type: { type: String, require: true },
    date: { type: Date, require: true },
    points: { type: Number, require: true },
    frequency: { type: String, require: true },
    done: { type: Boolean, require: true },
  },
  { timestamps: true }
);

module.exports = choreTodaySchema;
