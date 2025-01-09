const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const householdChoreSchema = new Schema(
  {
    adminID: { type: String, require: true },
    chore_name: { type: String, require: true },
    frequency: { type: String, require: true },
    points: { type: Number, require: true },
    type: { type: String, require: true },
    participants: { type: Array, require: true },
    participantsID: { type: Array, require: true },
    household: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = householdChoreSchema;
