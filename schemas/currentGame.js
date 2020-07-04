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
    },
    answers: [
        {
            username: {type: String},
            answer: {type: String}
        }
    ],
    scores: [
        {
            username: {type: String},
            score: {type: Number}
        }
    ],
    completed: [String],
});

module.exports = mongoose.model("currentGames", currentGameSchema);