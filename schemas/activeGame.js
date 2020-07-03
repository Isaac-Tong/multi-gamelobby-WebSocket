const mongoose = require("mongoose");

let activeGameSchema = new mongoose.Schema({
    roomID: {
        type: String,
        required: true,
    },
    username: [String],
});

module.exports = mongoose.model("activegames", activeGameSchema);