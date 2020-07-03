const express = require("express");
const router = express.Router();
const path = require('path');
require('../mongoose_connection')
const roomModel = require('../schemas/roomSchema');
const sanitize = require('./middleware/sanitize')

//GET REQUEST TO DISPLAY THE HOMEPAGE
router.get('/', (req, res) => {

    //Redirect to their current game if browser already has a token installed
    if(req.cookies.token){
        return res.redirect('/game');
    }

    //Display the homepage if there is no token
    res.sendFile(path.join(__dirname, '../public/homePage.html'))
})

//ROUTE TO HANDLE USER CREATING GAME FROM MAIN PAGE
router.post('/create', sanitize, (req, res)=>{

    //Extract username from input form
    const username = req.body.name;

    //Create a random room ID
    const random = Math.random().toString(36).slice(8);

    //Create new database entry given the random room ID and first username
    const roomData = {
        roomID: random,
        userList: []
    }
    roomData.userList.push(username);
    const newRoom = new roomModel(roomData);
    newRoom.save();


    //Assign roomID and username to cookie
    let cookie = random + '.' + req.body.name;

    //Make browser store the cookie
    res.cookie("token", cookie, {httpOnly: true, sameSite: "lax"});

    //Redirect to game page
    res.redirect('/game');
})


//ROUTE TO HANDLE USER JOINING A GAME FROM MAIN PAGE
router.post('/join', sanitize, async (req, res) =>  {
    try {
        //Extract username and roomID from the input form
        const username = req.body.name;
        const roomID = req.body.roomID

        //Check if roomID exists
        const query = await roomModel.findOne({roomID: roomID});
        if(!query){
            //Redirect to error page if roomID is not found
            return res.redirect('/error');
        }

        //Store the username into corresponding room database
        await roomModel.findOneAndUpdate({roomID: roomID}, { "$push": {userList: username}});


        //Store cookie into browser
        let cookie = roomID + '.' + username;

        //Make browser store the cookie
        res.cookie("token", cookie, {httpOnly: true, sameSite: "lax"});

        //Redirect to game page
        res.redirect('/game');
    } catch (error) {
        res.redirect('/allError')
    }
})


module.exports = router;