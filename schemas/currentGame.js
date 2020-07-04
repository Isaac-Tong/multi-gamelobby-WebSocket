const mongoose = require("mongoose");

let currentGameSchema = new mongoose.Schema({
    roomID: {
        type: String,
        required: true,
    },
    username: [String],
    rounds: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model("currentGames", currentGameSchema);