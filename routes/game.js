const express = require("express");
const router = express.Router();
const path = require('path');


//DISPLAY THE PAGE FOR THE GAME PAGE
router.get('/', (req, res) => {

    //Redirect to Home Page if browser does not have cookie
    if(!req.cookies.token){
        return res.redirect('/')
    }

    //Decode the cookie
    const cookie = req.cookies.token
    const cookieSplit = cookie.split('.');
    const roomID = cookieSplit[0];
    const name = cookieSplit[1];

    res.render('gamePage', {roomID: roomID, username: name})
})

module.exports = router;