const express = require('express');
const socket = require('socket.io')
const bodyParser = require('body-parser')
const app = express();
const cookieParser = require('cookie-parser');
const activeGameModel = require('./schemas/activeGame')
const socketModel = require('./schemas/socket')
const currentGameModel = require('./schemas/currentGame')
const questionModel = require('./schemas/questionSchema')


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
const addQuestionRouter = require('./routes/addQuestions')

app.use('/', homepageRouter);
app.use('/game', gameRouter);
app.use('/error', nonExistRouter);
app.use('/allError', allErrorRouter);
app.use('/addQuestion', addQuestionRouter)











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
        
        //Mark roomLobbies collection startedGame to true
        await activeGameModel.findOneAndUpdate({roomID: data}, {startedGame: true}); 

        //Get array of usernames in the lobby from the database
        const lobby = await activeGameModel.findOne({roomID: data}, 'username -_id');

        //Create new currentGame collection
        const current = {
            roomID: data,
            username: lobby.username.length,
            rounds: 0,
        }

        const newCurrent = new currentGameModel(current);
        newCurrent.save();

        //Get index 0 or first question in the question collection
        const firstQuestion = await questionModel.findOne({index: 0});

        const questionParts = {
            part1: firstQuestion.part1,
            part2: firstQuestion.part2,
        }
        
        io.to(data).emit('firstRound', questionParts)
    })
    socket.on('submitAnswer', async (data)=> {

        //Clear all the answers


        await currentGameModel.update({roomID: data.roomID}, { $push: { answers: {username: data.username, answer: data.answer} } })
        await currentGameModel.update({roomID: data.roomID}, { $push: {completed: data.username}})

        const current = await currentGameModel.findOne({roomID: data.roomID});

        io.to(socket.id).emit('submitComplete', current.completed);
    


    })



})