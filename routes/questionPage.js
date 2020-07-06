const express = require("express");
const router = express.Router();
const path = require('path');


//DISPLAY THE PAGE FOR THE GAME PAGE
router.get('/', (req, res) => {

    res.send('questionPage')

    
})

module.exports = router;