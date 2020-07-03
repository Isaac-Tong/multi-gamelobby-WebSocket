const mongoose = require("mongoose");

let activeGameSchema = new mongoose.Schema({
    roomID: {
        type: String,
        required: true,
    },
    sockets: [String],
    userList: [
        {
            username: {
                type: String
            },
            socketID: {
                type: String,
            }
        }
    ],
});

module.exports = mongoose.model("activeGame", activeGameSchema);