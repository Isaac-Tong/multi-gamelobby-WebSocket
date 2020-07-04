const mongoose = require("mongoose");

let questionSchema = new mongoose.Schema({
    part1: {
        type: String,
        required: true,
    },
    part2: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        default: 0,
    }

});

module.exports = mongoose.model("questions", questionSchema);