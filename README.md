# Realtime Multiplayer Game Lobby

### Showcase

<img src="https://github.com/Isaac-Tong/multi-gamelobby-WebSocket/blob/master/showcase/demo_gif.gif" width="560" height="350" />
<p float="left">
  <img src="https://github.com/Isaac-Tong/multi-gamelobby-WebSocket/blob/master/showcase/lobby.png" width="400"/>
  <img src="https://github.com/Isaac-Tong/multi-gamelobby-WebSocket/blob/master/showcase/create_game_page.png" width="400"/>
</p>

### About the Project
Created a multiplayer game lobby that includes both a create/join game page and a player waiting lobby. Sockets are used between the client and server to create seemless and realtime updates of player connections. Upon creation of a game, a random six character alphanumeric code is generated for the roomId and is used to identify the current game lobby. This roomID is then stored in a mongoDB database along with the usernames of the players in the lobby. Furthermore, many checks for clients are implement into the server logic. These include redirecting clients to their current lobby if clients decides to refresh or close the page. Upon loading the home page, server checks if browser has a stored cookie which unique identifies the player's name and roomID. 

### Usage
Install necessary dependencies
```bash
$ npm install
```
Start express local server
```bash
$ npm start
```
Create an .env file and store in root directory
```
DB_URL=[Your mongoDB address]
```

Access lobby page on browser
```
http://localhost:3000/
```

### Technologies Used
* Express
* Socket.io
* Mongoose

### UI Design
https://colorlib.com/wp/template/creative-login-form/
