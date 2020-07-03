const mongoose = require("mongoose");

let activeGameSchema = new mongoose.Schema({
    roomID: {
        type: String,
        required: true,
    },
    userList: [String],
});

module.exports = mongoose.model("activeGame", activeGameSchema);