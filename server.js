const express = require('express');
const socket = require('socket.io')
const bodyParser = require('body-parser')
const app = express();
const cookieParser = require('cookie-parser');



app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//Use EJS
app.set('view engine', 'ejs');


//ROUTE FOR CREATE GAME PAGE
app.get('/', (req, res) => {
    //Redirect to their current game if there is already a token
    if(req.cookies.token){
        let cookie = req.cookies.token
        let cookieSplit = cookie.split('.');
        let roomID = cookieSplit[0];
        let name = cookieSplit[1];
    
        //Send them to their room
         return res.render('gamePage', {roomID: roomID})
    }

    res.sendFile(__dirname + '/public/start.html')
})

app.get('/game', (req, res) => {
    //If there is no cookie in the browser, redirect them to the create game page
    if(req.cookies.token == undefined){
        return res.redirect('/')
    }

    //If there is a cookie in the browser, redirect them to their current game 
    //Split the cookie up into their name and their roomID
    let cookie = req.cookies.token
    let cookieSplit = cookie.split('.');
    let roomID = cookieSplit[0];
    let name = cookieSplit[1];

    //Send them to their room
    res.render('gamePage', {roomID: roomID})
})

app.post('/game', (req, res)=>{

    //If there is already a
    if(req.cookies.token){
        let cookie = req.cookies.token
        let cookieSplit = cookie.split('.');
        let roomID = cookieSplit[0];
        let name = cookieSplit[1];
    
        //Send them to their room
        return res.render('gamePage', {roomID: roomID})
    }

    console.log(req.body);

    //Create a random room ID
    let random = Math.random().toString(36).slice(2);

    let cookie = random + '.' + req.body.name;

    res.cookie("token", cookie, {httpOnly: true, sameSite: "lax"});

    res.render('gamePage', {roomID: random})

})

//ROUTE TO HANDLE USER JOINING A GAME FROM MAIN PAGE
app.post('/join', (req, res) =>  {
    let gameID = req.body.gameID

    res.render('gamePage', {roomID: gameID})
})


const server = app.listen(3000, () => {
    console.log('Started server');
});

const io = socket(server);

io.on('connection', (socket)=>{
    //Check if connection has been established
    console.log('socket connection', socket.id)

    socket.on('createRoom', (data) => {
        console.log(data);
    })

    // socket.broadcast.emit()

    // socket.on('message', (data) => {
    //     console.log(data);
    //     io.sockets.emit('message', data);
        
    // })
})