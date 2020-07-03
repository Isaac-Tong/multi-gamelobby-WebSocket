const express = require('express');
const socket = require('socket.io')
const bodyParser = require('body-parser')
const app = express();
const cookieParser = require('cookie-parser');


//EXPRESS
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//Use EJS
app.set('view engine', 'ejs');

//Routing
const homepageRouter= require('./routes/homePage');
const gameRouter = require('./routes/game')
const nonExistRouter = require('./routes/non_existant_game')
const allErrorRouter = require('./routes/allError')

app.use('/', homepageRouter);
app.use('/game', gameRouter);
app.use('/error', nonExistRouter);
app.use('/allError', allErrorRouter);











//SOCKET
const server = app.listen(3000, () => {
    console.log('Started server');
});


const io = socket(server);

io.on('connection', (socket)=>{
    socket.emit('chat-message', 'hii')

    //Check if connection has been established
    console.log('Current socket connection:', socket.id)

    socket.join('room1');

    io.to('room1').emit('helloworld')

    // socket.on('createRoom', (data) => {
    //     console.log(data);
    // })

    // socket.broadcast.emit()

    // socket.on('message', (data) => {
    //     console.log(data);
    //     io.sockets.emit('message', data);
        
    // })


})