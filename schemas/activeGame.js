const mongoose = require("mongoose");

let activeGameSchema = new mongoose.Schema({
    roomID: {
        type: String,
        required: true,
    },
    username: [String],
    startedGame: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("roomlobbies", activeGameSchema);