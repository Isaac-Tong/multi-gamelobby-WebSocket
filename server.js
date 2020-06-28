const express = require('express');
const socket = require('socket.io')
var bodyParser = require('body-parser')
const app = express();


app.use(express.urlencoded({extended: true}))

//Use EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/start.html')
})

app

app.post('/game', (req, res)=>{
    console.log(req.body);

    //Create a random room ID
    let random = Math.random().toString(36).slice(2);


    res.render('index', {roomID: random})
    // res.sendFile(__dirname + '/public/index.html')
})

app.get('/game/:id', (req, res) => {

    res.render('index', {roomID: req.params.id})
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