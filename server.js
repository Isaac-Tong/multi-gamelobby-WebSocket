const express = require('express');
const socket = require('socket.io')
const bodyParser = require('body-parser')
const app = express();
const cookieParser = require('cookie-parser');
const activeGameModel = require('./schemas/activeGame')


//EXPRESS
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//Use EJS
app.set('view engine', 'ejs');

//Routing
const homepageRouter= require('./routes/homePage');
const gameRouter = require('./routes/game')
const nonExistRouter = require('./routes/non_existant_game')
const allErrorRouter = require('./routes/allError');
const activeGame = require('./schemas/activeGame');

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

    //Check if connection has been established
    console.log('Current socket connection:', socket.id)

    //Connect to a room
    socket.on('Join_Game', async (data) => {
    
        //Subscribe to the room defined by data.roomID
        socket.join(data.roomID);

        //Check if roomID is stored in activeGame database
        const query = await activeGameModel.findOne({roomID: data.roomID});

        //Add user to the roomID document if there is already an active document
        if(query){
            await activeGameModel.findOneAndUpdate({roomID: data.roomID}, { "$push": {userList: data.username}});
        }

        //Create a new active document if none has been created yet
        const roomData = {
            roomID: data.roomID,
            userList: []
        }
        roomData.userList.push(data.username);
        const newGame = new activeGameModel(roomData);
        newGame.save();
        io.to(data.roomID).emit('Update_User', data.username)
    })

    

    // socket.join('room1');

    // io.to('room1').emit('helloworld')

    // socket.on('createRoom', (data) => {
    //     console.log(data);
    // })

    // socket.broadcast.emit()

    // socket.on('message', (data) => {
    //     console.log(data);
    //     io.sockets.emit('message', data);
        
    // })


})