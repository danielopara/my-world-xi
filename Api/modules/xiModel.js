const mongoose = require("mongoose");

const xiSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    player_number: { type: Number, required: true },
    position: {
      type: String,
      required: true,
      enum: ["GoalKeeper", "Defender", "Midefielder", "Forward"],
    },
    foot: { type: String, required: true, enum: ["Left", "Right", "Both"] },
  },
  {
    collection: "PlayerXI",
  }
);

module.exports = mongoose.model("Players", xiSchema);
