//  Note.- Do not use import ... from ... (socketio does not work well with ES6)
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv')
dotenv.config();

const constants = {
  webServer: {
    myLocal_Host: '127.0.100.1',
    myPort: 5001
  }
}
const newPortWebSocket = 5002;
let usersActivInChat = [];  //  Activ Users in the chat
// import { generateIDRandom, whatTimeIsIt } from './utils/functions.js';

//  CONSTANTS:  myLocalHost, myPort
const myLocalHost = process.env.LOCALHOST || constants.webServer.myLocal_Host;
const myPort = process.env.PORT || constants.webServer.myPort;
// const myMongoDBConnection = process.env.DB_CONN || 'mongodb://localhost:27017/11_17_cookies2'
// const myCorsOptions = constants.corsOption
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// const IDRANDOM_OF_SESSION = generateIDRandom();


//   Instantation vom WebServer Express   ///////////////////////////////////////////////////////////////////////////////////////
const app = express();


//   MIDDLEWARE  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Regelt die kommunikation zwischen BROWSER und Server. nur wenn die aktuelle
// url des Browsers gewhitelistet ist, darf der browser die antwort lesen
// Controla la comunicación entre el BROWSER y el servidor. 
// Sólo si la url del navegador aparece en la lista, el navegador puede leer la respuesta.
app.use(cors({
  // origin: `${myLocalHost}:${myPort}` //  <<== url donde la politica cors del servidor es permitida
  // credentials: true //  <<==  algo con las cookies
  origin: '*'
}));

app.use(express.urlencoded({ extended: true })) //  <<==  Calling the express.urlencoded({ extended: true }) method //
//  middleware intern, for parsing
app.use(express.json({ limit: '50MB' })) //  <<==  Calling the express.json()
// app.use(cookieParser()) //  <<==  Cookies are parsers
//app.use(express.static('static'))
app.use(morgan('dev'));


//   METHOD LISTEN OF WEBSERVER EXPRESS  ////////////////////////////////////////////////////////////////////////////////////////
function whatTimeIsIt() {
  const theTimeIs = new Date;
  return theTimeIs;
}
const server = app.listen(myPort, () => {
  console.clear()
  console.log('')
  console.log('                                                                     '.bgRed)
  console.log('                                                                     '.bgRed)
  console.log('                                                                     '.bgYellow)
  console.log(`   WebServer Express Listening, listening on: "${myLocalHost}:${myPort}"     `.bgYellow)
  console.log('                                                                     '.bgYellow)
  console.log('                                                                     '.bgRed)
  console.log('                                                                     '.bgRed)
  console.log('')
  console.log(`  ${whatTimeIsIt()}   `.bgRed)
  console.log('')
});


//  CONFIGURATION OF SOCKET.IO: requirement of the "socket.io" library in the server project.  Configuration of connections and disconnections
const http = require('http').createServer(app);   //  <<== Take the "http" protocol and create an 'http' Web Server Express.

const socketIO = require('socket.io')(http, {     //  <<== Instantiating a Web Server socket.io
  cors: {
    origin: '*'
  }
});

//  I start the WebServerSocketIO, listening with the port: const newPortWebSocket: 5002;
http.listen(newPortWebSocket, () => {
  console.log(`Server listening on ${newPortWebSocket}`);
});


// Method "on" form Socket IO Server.  Nota.-  Add this before the app.get() block
socketIO.on('connection', (socket) => {
  //  Conection with socket.io
  console.log(`⚡ : ${socket.id} user just connected!  `.bgRed);  //  <<==  Creation of a "unique id" for the user logged on via socket
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
  });

  // EventListener on the SocketIO server (server.js).  If the "typing" event occurs the socketIO server will respond by broadcasting
  // to all connected active users of the application (via socket.broadcast.emit) with another event: "typingResponse", sending the data
  // to the connected users.
  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users activs in the chat:  usersActivInChat
    usersActivInChat.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', usersActivInChat);
  });

  //  Disconnected with socket.io
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected'.bgWhite);  //  <<==  User information disconnected by the socket disconnection event
    //Updates the list of users when a user disconnects from the server
    usersActivInChat = usersActivInChat.filter((user) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', usersActivInChat);
    socket.disconnect();
  });
});


//  REQUEST:  GET room
app.get("/", (req, resp) => {
  resp.send("Server is running!!");
  console.log("Server is running!!".bgBlue);
});


//   MANAGEMENT OF ERRORS (MIDDElWARE)  /////////////////////////////////////////////////////////////////////////////////////
app.use((req, res, next) => {
  next({
    status: 404,
    message: 'Page not-found'
  })
})

app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    message: error.message
  })
})

// export { myLocalHost, myPort, IDRANDOM_OF_SESSION };



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Dependencies installed: 

//                1.-   "colors" => get color and style in your node.js console).
//                2.-   "morgan" => HTTP request logger middleware for node.js.
//                3.-   "cors"   => CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
//                4.-   "express" => Fast, unopinionated, minimalist web framework for Node.js (used for Web Server http)
//                5.-   "dotenv" => Dotenv is a zero-dependency module that loads environment variables from a ".env" file into "process.env."" Storing
//                                  configuration in the environment separate from code is based on The Twelve-Factor App methodology.
//                6.-   "socket.io" => Socket.IO enables real-time bidirectional event-based communication. It consists of:

//                                    1.-  a "Node.js server" (this repository)
//                                    2.-  a "Javascript client library" for the browser (or a Node.js client)

//                                    Install (npm):  npm install socket.io --save
//                                    Use (example):  const server = require('http').createServer();
//                                                    const io = require('socket.io')(server);
//                                                    io.on('connection', client => {
//                                                      client.on('event', data => { /* … */ });
//                                                      client.on('disconnect', () => { /* … */ });
//                                                    });

//                                                    server.listen(3000);

//                                   Module syntax (ES6):
//                                                        import { Server } from "socket.io";
//                                                        const io = new Server(server);
//                                                        io.listen(3000);

//                                   In conjunction with Express: Starting with 3.0, express applications have become request handler functions that you pass 
//                                                                to http or http Server instances. You need to pass the Server to socket.io, not the express 
//                                                                application function. Also make sure to call .listen on the server, not the app.

//                                                                const app = require('express')();
//                                                                const server = require('http').createServer(app);
//                                                                const io = require('socket.io')(server);
//                                                                io.on('connection', () => { /* … */ });
//                                                                server.listen(3000);
