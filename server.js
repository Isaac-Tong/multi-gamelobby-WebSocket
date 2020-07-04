const express = require('express');
const socket = require('socket.io')
const bodyParser = require('body-parser')
const app = express();
const cookieParser = require('cookie-parser');
const activeGameModel = require('./schemas/activeGame')
const socketModel = require('./schemas/socket')
const currentGameModel = require('./schemas/currentGame')


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
const currentGame = require('./schemas/currentGame');

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
    // console.log('Current socket connection:', socket.id)

    //Connect to a room
    socket.on('Join_Game', async (data) => {
        
        
       
        
        //Check if roomID is stored in activeGame database
        const query = await activeGameModel.findOne({roomID: data.roomID});
        //Append username and socketID
        const socketUsername = data.username + '.' + socket.id;
        
        //Add user and socketID to the roomID document if there is already an active document
        if(query){
    
            
            await activeGameModel.findOneAndUpdate({roomID: data.roomID}, { '$push' : {username: socketUsername}}, {useFindAndModify: false});
            
            const newSocket = new socketModel({
                socket: socket.id,
                username: data.username,
                roomID: data.roomID
            });
            await newSocket.save();

            //Subscribe to the room defined by data.roomID
            socket.join(data.roomID);

            const connected = await activeGameModel.findOne({roomID: data.roomID});

            const connectedUsers = {
                connected: [],
            };

            for(let i = 0; i < connected.username.length; i++){
                //Split the string
                const arr = connected.username[i].split('.');
    
                connectedUsers.connected[i] = arr[0];
            }

            io.to(data.roomID).emit('Update_User', connectedUsers)

            return;
        }
        
        //Create a new active document if none has been created yet
        const roomData = {
            roomID: data.roomID,
            username: []
        }
        roomData.username.push(socketUsername);
        const newGame = new activeGameModel(roomData);
        newGame.save();
        
        const newSocket = new socketModel({
            socket: socket.id,
            username: data.username,
            roomID: data.roomID
        
        });
        await newSocket.save();

        //Subscribe to the room defined by data.roomID
        socket.join(data.roomID);

        const connected = await activeGameModel.findOne({roomID: data.roomID});

        const connectedUsers = {
            connected: [],
        };

        for(let i = 0; i < connected.username.length; i++){
            //Split the string
            const arr = connected.username[i].split('.');

            connectedUsers.connected[i] = arr[0];
        }

        io.to(data.roomID).emit('Update_User', connectedUsers)

    })

    socket.on('disconnect', async () => {
        console.log('disonnected');
        
        //Find which roomID and username the socket is referring to
        const removedSocket = await socketModel.findOneAndRemove({socket: socket.id}, {useFindAndModify: false});
        
        //Delete the corresponding socket from the activeGames database
        const appendedSocketUsername = removedSocket.username +  '.' + removedSocket.socket;
        await activeGameModel.update({roomID: removedSocket.roomID}, { "$pull": {username : appendedSocketUsername} })


        //EMIT TO ALL SOCKETS THAT ONE USER HAS LEFT
        const connected = await activeGameModel.findOne({roomID: removedSocket.roomID});

        const connectedUsers = {
            connected: [],
        };

        for(let i = 0; i < connected.username.length; i++){
            //Split the string
            const arr = connected.username[i].split('.');

            connectedUsers.connected[i] = arr[0];
        }

        io.to(removedSocket.roomID).emit('Update_User', connectedUsers)

    })

    socket.on('Start_Game', async (data) => {

        //Get array of usernames in the lobby from the database
        const lobby = await activeGameModel.findOne({roomID: data}, 'username -_id');
        //Create new currentGame collection
        const current = {
            roomID: data,
            username: lobby.username,
            rounds: 0,
        }
        const newCurrent = new currentGameModel(current);
        newCurrent.save();


        //SEND BACK DATA FOR THE FIRST QUESTION
        

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