const mongoose = require("mongoose");

let socketSchema = new mongoose.Schema({
    socket: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    roomID: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('sockets', socketSchema);