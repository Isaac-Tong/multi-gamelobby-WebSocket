const express = require("express");
const router = express.Router();
const path = require('path');

//GET REQUEST TO DISPLAY THE HOMEPAGE
router.get('/', (req, res) => {

    //Redirect to their current game if there is already a token
    if(req.cookies.token){
        let cookie = req.cookies.token
        let cookieSplit = cookie.split('.');
        let roomID = cookieSplit[0];
        let name = cookieSplit[1];
        //Send them to their room
         return res.render('gamePage', {roomID: roomID})
    }

    //Display the homepage if there is no token
    res.sendFile(path.join(__dirname, '../public/start.html'))
})

//ROUTE TO HANDLE USER CREATING GAME FROM MAIN PAGE
router.post('/create', (req, res)=>{

    //Extract username from input form
    let username = req.body.name;

    //Create a random rule ID
    let random = Math.random().toString(36).slice(8);

    //Create new entry in databse

    //Assign roomID and username to cookie
    let cookie = random + '.' + req.body.name;

    //Make browser store the cookie
    res.cookie("token", cookie, {httpOnly: true, sameSite: "lax"});




    res.render('gamePage', {roomID: random})
})


//ROUTE TO HANDLE USER JOINING A GAME FROM MAIN PAGE
router.post('/join', (req, res) =>  {

    //Extract username and roomID from the input form
    let username = req.body.name;
    let roomID = req.body.roomID

    //Check if roomID exists



    res.render('gamePage', {roomID: roomID})
})


module.exports = router;