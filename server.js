const express = require('express');
const socket = require('socket.io')
const bodyParser = require('body-parser')
const app = express();
const cookieParser = require('cookie-parser');


app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//Use EJS
app.set('view engine', 'ejs');

//Routing
const homepageRouter= require('./routes/homePage');
app.use('/', homepageRouter);



//SOCKET
const server = app.listen(3000, () => {
    console.log('Started server');
});


const io = socket(server);

io.on('connection', (socket)=>{

    //Check if connection has been established
    console.log('Current socket connection:', socket.id)

    socket.on('createRoom', (data) => {
        console.log(data);
    })

    // socket.broadcast.emit()

    // socket.on('message', (data) => {
    //     console.log(data);
    //     io.sockets.emit('message', data);
        
    // })
})