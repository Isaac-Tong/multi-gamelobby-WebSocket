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

});

module.exports = mongoose.model("questions", questionSchema);