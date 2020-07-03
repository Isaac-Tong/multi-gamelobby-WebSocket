const mongoose = require("mongoose");

let roomSchema = new mongoose.Schema({
    roomID: {
        type: String,
        required: true,
    },
    userList: [String],
});

module.exports = mongoose.model("room", roomSchema);