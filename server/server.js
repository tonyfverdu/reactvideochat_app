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


//  Aplicacion chat con React.js y node.js a traves de "socket.io"
/*
    1.-  Configuracion del proyecto: Crear una carpeta del proyecto, con dos subcarpetas:

          1.-  "Client" (aplicacion en React)
          2.-  "Server" (aplicacion backend en NodeJS)

          mkdir chat-react-app
          cd chat-app
          mkdir Client Server

    2.-  En la carpeta "Client", crear un proyecto en React (con Vite)

        cd client

        npm create vite@latest chat-react-app  (configutrev la aplicacion para React y javascript)

    3.-  Instalacion de las dependencias:

      O.-  A mi particularmente me gusta mucho utilizar el "analizador de codigo" ESLint(npm init @eslint/config) para los desarrollos
      (acostumbrarse a un estilo estandar)
      1.-  Para el server:  color, morgan, cors, express, dotenv, nodemon y socket.io

        npm install color, morgan, cors, express dotenv nodemon --save

        Nota.-  quito del package.json "type: module", ya que he tenido problemas con la import/exports con ES6.  Asi utilizar "require"
        en vez de "import" al importar las dependencias a los programas"

        En la carpeta "server" crear un fichero "server.js", donde se desarrollara la aplicacion servidora de la aplicacion chat de node.js,
        crear un fichero ".env" y meter las constantes: LOCALHOST='127.0.0.1 y PORT=3001 . Por ultimo crear dos carpetas mas, "utils" y "config",
        meter alli los ficheros de "utilidades" y "funciones generalöes2 apara la aplicacion servidora"

      2.-  Para el client (react):  react-router-dom (con NextJS no haria falta), la libreria de Material UI (npm install @mui/material @emotion/react
      @emotion/styled) y la api del cliente socket.io (socket.io-client).  Casi siempre instalo sass por si las moscas vario el diseno de la interfaz

        npm install socket.io-client react-router-dom sass

      2.1.-  Limpiar la App.js ( a tu gusto, a mi  me gusta solo dejar un div cental con ClassName="conCentral")
      2.2.-  En la carpeta "src" crear las carpetas:  "assets", "components", "Pages", "sass" y "functions"


    4.-  Aplicacion Server:  en el fichero "server.js" hay que crear un "servidor web", por ejemplo con "express"  Para ello primero requerimos las
    dependencias necesarias y se crea el codigo del web server con express con el middleware necesario arrancando un "listenig" al puerto que queramos:


    //  Creacion y configuracion de un servidor Node.js simple usando Express.js:
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


    //  CONSTANTS:  myLocalHost, myPort
    const myLocalHost = process.env.LOCALHOST || constants.webServer.myLocal_Host;
    const myPort = process.env.PORT || constants.webServer.myPort;


    //   Instantation vom WebServer Express   ///////////////////////////////////////////////////////////////////////////////////////
    const app = express();


    //   MIDDLEWARE  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.use(cors({
      origin: '*'  //  <<== o bien la "url" donde la "politica cors" del servidor es permitida
    }));

    app.use(express.urlencoded({ extended: true })) //  <<==  Calling the express.urlencoded({ extended: true }) method //
    //  middleware intern, for parsing
    app.use(express.json({ limit: '50MB' })) //  <<==  Calling the express.json()
    app.use(morgan('dev'));


    //  MANAGEMENT OF ERRORS (MIDDElWARE)  ///////////////////////////////////////////////////////////////////////////////////////
    app.use((req, res, next) => {
      next({
        status: 404,
        message: 'Page not-found'
      });
    });

    app.use((error, req, res, next) => {
      res.status(error.status || 500).send({
        message: error.message
      });
    });


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


    Se puede probar el servidor si funciona, crando una ruta "/api" y probando el codigo de un GET:

    app.get('/api', (req, res) => {
      res.json({
        message: 'Alles gut im Moment!!',
      });
    });

    Si funciona continua, si no piede ayuda ;-))


    5.-  Configurar nodemon
    En package.json escribir el comando script de inicio de "nodemon" a la lista de scripts:

      "start": "nodemon server/server.js"

      Asi, con npm start se iniciara "nodemon" para la aplicacion server del programa

    6.-  Importar (con "require") las biblioteca "http", para permitir la transferencia de datos entre el cliente y los dominios del servidor.
    Asignar la importacion al servidor express instanciado (con .Server(app))
      //New imports of librerie "http"
      const http = require('http').Server(app);

    7.-  Ahora requerimos la libreria "socket.io" en el proyecto del server.  Se creara una conexion "en tiempo real" entre el servidor y las
    distintas peticiones enviadas por los clientes (browser) de la aplicacion chat.

      const socketIO = require('socket.io')(http, {
        cors: {
          origin: "http://localhost:3000"
        }
      });

      //Add this before the app.get() block
      socketIO.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
          socket.on('disconnect', () => {
          console.log('🔥: A user disconnected');
        });
      });


    A partir del fragmento de código anterior, la funcion "socket.io" ("connection") establece una conexión con la aplicación cluente en React,
    luego crea un identificador "ID" único para cada socket y registra la ID en la consola cada vez que un usuario visita la página web.

    Cuando se "actualiza" o "cierra la página web", el "socket" activa el evento de "desconexión" que muestra que un usuario se ha desconectado del socket.


    4.-  Aplicacion Client en React:

        1.-  Conectar la aplicación React (App.jsx) al servidor Socket.io:  con esto la aplicación React se debe conectar con éxito al servidor a
                                                                            través de Socket.io.

              import socketIO from 'socket.io-client';

              const socket = socketIO.connect('http://127.0.100.1:5002');

        2.-  Página de inicio en React para la aplicación de chat:  se creara la pagina de inicio de la aplicacion, donde estara un pequeno formulario
                                                                    de nombre y contrasen (de momento se alamaceraran los datos en local store, posteriormente
                                                                    puede guardarse en una base ed datos como MongoDB)

            2.1.-  Componente Home.jsx (pagina de inicio de la aplicacion chat):  en la carpeta de components crear un componente React "Home.jsx"

                    import React, { useState } from 'react';
                    import { useNavigate } from 'react-router-dom';

                    function Home () {
                      const navigate = useNavigate();  //  El hook "useNavigate" de ReactRouter devuelve una función que permite navegar mediante programación
                      const [userName, setUserName] = useState('');  //  variable de estado de "nombre del usuario" del chat, controlado por React

                      //  Funcion submit del "button" del formulario de entrada al chat
                      const handleSubmit = (ev) => {
                        ev.preventDefault();
                        localStorage.setItem('userName', userName);  //  <== almacenamiento en "local storage" del nombre de usuario
                        navigate('/chat');  //  <== ir a la pagina de "chat" de la aplicacion.  La API imperativa de React Router "navigate(ruta) permite
                        //                          navegar mediante programación. Es decir, cambia la ubicación actual cuando se representa.
                      };


                      return (
                        <form className="home__container" onSubmit={handleSubmit}>
                          <h2 className="home__header">Sign in to Open Chat</h2>
                          <label htmlFor="username">Username</label>
                          <input type="text" minLength={6} name="username" id="username" className="username__input"
                          value={userName)onChange={(e) => setUserName(e.target.value)} />
                          <button className="home__cta">SIGN IN</button>
                        </form>
                      );
                    };

                    export default Home;


            2.2.-  Configurar "React Router" para habilitar la navegación entre las páginas de la aplicación de chat:
                   (de momento solamente se crearan dos página: la pagina de inicio y la pagina de chat).

                   En App.jsx: asignacion de diferentes rutas para la página de Inicio: Home.jsx (path="/" ) y la pagina
                   del Chat: ChatPage.jsx (path="/chat") de la aplicación usando React Router v6 y pasa la biblioteca Socket.io a los componentes

                    import { BrowserRouter, Routes, Route } from 'react-router-dom';
                    import socketIO from 'socket.io-client';
                    import Home from './components/Home.jsx';
                    import ChatPage from './components/ChatPage.jsx';


                    const socket = socketIO.connect('http://localhost:4000');  //  <<== conexion por socket.io a el socket server del backend


                    function App() {
                      return (
                        <BrowserRouter>
                          <div>
                            <Routes>
                              <Route path="/" element={<Home socket={socket} />}></Route>
                              <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
                            </Routes>
                          </div>
                        </BrowserRouter>
                      );
                    }

                    export default App;

        3.- Página de Chat de la aplicación: ChatPage.jsx  (en la carpeta "Pages")

        La página principal de chat de la aplicacion, ChatPage.jsx, se dividira en tres secciones, que se desarrollaran con tres componentes
        (en la carpeta "components")

          1.-  Barra del chat: "ChatBar.jsx", es la barra lateral que muestra los usuarios activos.
          2.-  Cuerpo del chat: "ChatBody.jsx", que contiene los mensajes enviados y el encabezado.
          3.-  Pie del chat:  "ChatFooter.jsx", que contiene el cuadro de mensaje y el botón de envío.

          En la "pagina" del chat:  "ChatPage.jsx":

                    import React from 'react';
                    import ChatBar from ''../components/ChatBar.jsx';
                    import ChatBody from ''../components/ChatBody.jsx';
                    import ChatFooter from ''../components/ChatFooter.jsx';


                    function ChatPage({ socket }) {
                      return (
                        <div className="chat">
                          <ChatBar />
                            <div className="chat__main">
                            <ChatBody />
                            <ChatFooter />
                          </div>
                        </div>
                      );
                    };

                    export default ChatPage;

        3.1.-  Componente:  ChatBar.jsx  (interfaz con la informacion de usuarios activos del chat (active users))

                  import React from 'react';

                  function ChatBar() {
                    return (
                      <div className="chat__sidebar">
                        <h2>Open Chat</h2>

                        <div>
                          <h4 className="chat__header">ACTIVE USERS</h4>
                          <div className="chat__users">
                            <p>User 1</p>
                            <p>User 2</p>
                            <p>User 3</p>
                            <p>User 4</p>
                          </div>
                        </div>
                      </div>
                    );
                  };

                  export default ChatBar;


        3.2.-  Componente:  ChatBody.jsx  (interfaz que muestra los mensajes enviados y el título de la página)

                  import React from 'react';
                  import { useNavigate } from 'react-router-dom';


                  function ChatBody() {
                    const navigate = useNavigate();

                    const handleLeaveChat = () => {
                      localStorage.removeItem('userName');
                      navigate('/');
                      window.location.reload();
                    };


                    return (
                      <>
                        <header className="chat__mainHeader">
                          <p>Hangout with Colleagues</p>
                            <button className="leaveChat__btn" onClick={handleLeaveChat}>
                              LEAVE CHAT
                            </button>
                        </header>

                        {/ *This shows messages sent from you * /}
                        <div className="message__container">
                          <div className="message__chats">
                            <p className="sender__name">You</p>
                            <div className="message__sender">
                              <p>Hello there</p>
                            </div>
                          </div>

                          {/ * This shows messages received by you * /}
                          <div className="message__chats">
                            <p>Other</p>
                            <div className="message__recipient">
                              <p>Hey, I'm good, you?</p>
                            </div>
                          </div>

                          {/ * This is triggered when a user is typing * /}
                          <div className="message__status">
                            <p>Someone is typing...</p>
                          </div>
                        </div>
                      </>
                    );
                  };

                  export default ChatBody;


        3.3.-  Componente:  ChatFooter.jsx  (entrada del mensaje de texto y botón de enviar ("send").
                            El mensaje y el nombre de usuario aparecen en la consola después de enviar el formulario.)

                  import React, { useState } from 'react';

                  function ChatFooter() {
                    const [message, setMessage] = useState('');

                    const handleSendMessage = (ev) => {
                      ev.preventDefault();
                      console.log({ userName: localStorage.getItem('userName'), message });
                      setMessage('');
                    };


                    return (
                      <div className="chat__footer">
                        <form className="form" onSubmit={handleSendMessage}>
                          <input type="text" placeholder="Write message" className="message" value={message} onChange={(ev) => setMessage(ev.target.value)} />
                          <button className="sendBtn">SEND</button>
                        </form>
                      </div>
                    );
                  };

                  export default ChatFooter;


      4.-  Envío bidireccional de mensajes ("messages") entre la aplicación React (Client) y el servidor Socket.io (Web SocketIO Server).

            ||  Client - Browser  || <socket.io client>  <<  ========  mesages =========  >>  <socket.io server> || Web Socket Server ||

            Application Rect (App.js) ==> import socketIO from 'socket.io-client';

            //  CONFIGURATION OF SOCKET.IO: requirement of the "socket.io" library in the server project.  Configuration of connections and disconnections
            Application server.js (Node.js)  ==>  const http = require('http').createServer(app);
                                                  const socketIO = require('socket.io')(http, {
                                                    cors: {
                                                            origin: '*'
                                                    }
                                                  });

                                                  http.listen(newPortWebSocket, () => {
                                                    console.log(`Server listening on ${newPortWebSocket}`);  //  const newPortWebSocket = 5002;
                                                  });

      4.1.-  Componente que envia los mensajes desde la aplicacion React:  ChatFooter.jsx

              Pasar la biblioteca Socket.io al componente "ChatFooter.jsx", componente que envía los mensajes.

      4.1.1-  Actualizar el componente "ChatPage.jsx", para pasar la biblioteca "Socket.io" al componente "ChatFooter.jsx."

                    import React from 'react';
                    import ChatBar from ''../components/ChatBar.jsx';
                    import ChatBody from ''../components/ChatBody.jsx';
                    import ChatFooter from ''../components/ChatFooter.jsx';


                    function ChatPage({ socket }) {
                      return (
                        <div className="chat">
                          <ChatBar />
                            <div className="chat__main">
                            <ChatBody />
                            <ChatFooter />
                          </div>
                        </div>
                      );
                    };

                    export default ChatPage;


        4.1.2-  En el componente "ChatFooter.jsx" Actualizar la funcion "handleSendMessage" para poder enviar el mensaje al servidor SocketIO en Node.js .

                  import React, { useState } from 'react';

                  function ChatFooter({ socket }) {               //  <<==  Pasar como prop el socket
                    const [message, setMessage] = useState('');

                    const handleSendMessage = (ev) => {
                      ev.preventDefault();
                      if (message.trim() && localStorage.getItem('userName')) {  //  Si el message no esta "vacio" (no es '')  y existe nombre de usuario "almacenado"
                                                                                 //  en "local Storage".
                                                                                 //  Si true   => envio de mensaje ("message") introducido en el input por "socket.emit"
                                                                                 //  Si false  => set the message to:  ''
                        socket.emit('message', {
                                                  text: message,
                                                  name: localStorage.getItem('userName'),
                                                  id: `${socket.id}${Math.random()}`,
                                                  socketID: socket.id,
                                                });
                        }
                      setMessage('');
                    };

                    return (
                      <div className="chat__footer">
                        <form className="form" onSubmit={(ev) => handleSendMessage(ev)}>
                          <input type="text" placeholder="Write message" className="message" value={message} onChange={(ev) => setMessage(ev.target.value)} />
                          <button className="sendBtn">SEND</button>
                        </form>
                      </div>
                    );
                  };

                  export default ChatFooter;


              La funcion "handleSendMessage(ev)" verifica primero si el campo de texto NO está vacío(''), y si el nombre de usuario existe en el almacenamiento
              local ("local storage") (iniciar sesión desde la página de inicio) antes de enviar el evento de mensaje ("message") que contiene un argumento objeto
              con:

                    - text: message  ==>> la entrada de texto del usuario.
                    - name: localStorage.getItem('userName')  ==>>  el nombre de usuario almacenado el "Local Storage"
                    - id: `${socket.id}${Math.random()}`  ==>> una "id" "unica" (buffff) querepresenta la id del mensaje generado.
                    - socketID: socket.id  ==>>  La "id2 del socket del cliente (socket.id) utilizado en el envio del mensaje


      4.1.3-  Codigo que permite escuchar los "eventos" de envio de mensajes por parte de los clientes socket.io de la aplicacion chat

              En "server.js" (aplicacion servidor de la aplicacion chat), actualizar el bloque de código "Socket.io" para "escuchar el evento" del envio del
              mensaje del cliente de la aplicación React, y registre el mensaje en la terminal del servidor.


                socketIO.on('connection', (socket) => {
                  console.log(`⚡: ${socket.id} user just connected!`);

                  //Listens and logs the message to the console
                  socket.on('message', (data) => {
                    console.log(data);
                  });

                  socket.on('disconnect', () => {
                    console.log('🔥: A user disconnected');
                  });
                });


      4.1.4.-  Envio del "message" recibido en el Server a todos los usuarios conectados en la aplicacion chat.

              Hemos podido recuperar el mensaje en el servidor; por lo tanto, enviemos el mensaje a todos los clientes conectados.

              En la aplicacion "server.js" de la aplicacion backend:

                socketIO.on('connection', (socket) => {
                  console.log(`⚡: ${socket.id} user just connected!`);

                  //sends the message to all the users on the server
                  socket.on('message', (data) => {
                    socketIO.emit('messageResponse', data);
                  });

                  socket.on('disconnect', () => {
                    console.log('🔥: A user disconnected');
                  });
                });

      4.1.5.-  Mostrar mensaje enviado por el servidor SocketIO a los activ users: componente "ChatPage.jsx".

               Actualizar componente "ChatPage.jsx" para escuchar los mensajes enviador por el server, y mostrar el mensaje
               enviado por el servidor SocketIO a los usuarios activos conectados.


                import React, { useEffect, useState } from 'react';
                import ChatBar from '../components/ChatBar.jsx';
                import ChatBody from '../components/ChatBody.jsx';
                import ChatFooter from '../components/ChatFooter.jsx';

                 function ChatPage({ socket }) {
                    const [arrayMessages, setArrayMessages] = useState([]);  //  Array de "messages" del chat
                                                                 //  (enviados y controlados por el server SocketIO)

                    //  Cada vez que llega un nuevo mensaje por el socket (evento listener "messageResponse") del server SocketIO,
                    //  escucho (metodo socket.io) lo muestra en pantalla
                    useEffect(() => {
                      socket.on('messageResponse', (data) => setArrayMessages([...arrayMessages, data]));
                    }, [socket, messages]);

                    return (
                      <div className="chat">
                        <ChatBar socket={socket} />
                          <div className="chat__main">
                            <ChatBody messages={arrayMessages} />
                            <ChatFooter socket={socket} />
                          </div>
                      </div>
                    );
                  };

                 export default ChatPage;


                Desde el fragmento de código anterior, Socket.io "escucha" los mensajes enviados a través del evento "messageResponse"
                y distribuye los datos en la matriz de mensajes (arrayMessages). La matriz de mensajes "arrayMessages" se pasa al
                componente "ChatBody.jsx" para que se muestre en la interfaz de usuario.


       4.1.6.-  Component "ChatBody.jsx": se le pasa la props "arrayMessages" y actualiza la pantalla del chat

                Actualice el componente "ChatBody.jsx", para representar los datos de la matriz de mensajes recibida en la prop: "messages".

                  import React from 'react';
                  import { useNavigate } from 'react-router-dom';

                  function ChatBody({ messages, userName }) => {
                    const navigate = useNavigate();

                    //  Borrar usuario activo pasado como "prop" de la lista de activ users. cambiar a pagina inicial del chat y recargar
                    const handleLeaveChat = () => {
                      localStorage.removeItem('userName');
                      navigate('/');
                      window.location.reload();
                    };

                    return (
                      <>
                        <header className="chat__mainHeader">
                          <p>Hangout with Colleagues</p>
                            <button className="leaveChat__btn" onClick={handleLeaveChat}>LEAVE CHAT</button>
                        </header>

                        <div className="message__container">
                          {messages.map((message) =>
                            message.name === localStorage.getItem('userName') ? (
                              <div className="message__chats" key={message.id}>
                                <p className="sender__name">You</p>
                                <div className="message__sender">
                                  <p>{message.text}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="message__chats" key={message.id}>
                                <p>{message.name}</p>
                                <div className="message__recipient">
                                  <p>{message.text}</p>
                                </div>
                              </div>
                            )
                          )}

                          <div className="message__status">
                            <p>Someone is typing...</p>
                          </div>
                        </div>
                      </>
                    );
                  };

                  export default ChatBody;


                El fragmento de código anterior muestra los mensajes dependiendo de si usted u otro usuario envió el mensaje.
                Los mensajes en verde son los que enviaste y en rojo son los mensajes de otros usuarios.

                Felicitaciones 🥂, la aplicación de chat ya está funcional. Puede abrir varias pestañas y enviar mensajes de una a otra.


      5.- Obtencion de los usuarios activos de la aplicacion chat en SocketIO.

          Desarrolo del codigo para poder obtener todos los usuarios "activos" (conectados) del chat, y mostrarlos en la barra de chat
          de la aplicación de chat (componente ChatBar.jsx).


          5.1.-  Interfaz de la aplicación de chat.  Evento  "newUser" de socketIO

                 En el cliente React, en el archivo "Home.js" crear un nuevo evento, que escuche a los usuarios cuando inician sesión.
                 Actualice la funcion "handleSubmit" como se muestra a continuación:

                    import React, { useState } from 'react';
                    import { useNavigate } from 'react-router-dom';


                    function Home({ socket }) => {
                      const navigate = useNavigate();  //  <<==  El hook "useNavigate" de ReactRouter devuelve una función
                                                       //  que permite realizar navegacion entre paginas mediante programación
                      const [userName, setUserName] = useState('');

                      //  Funcion submit del "button" del formulario de entrada al chat
                      const handleSubmit = (e) => {
                        e.preventDefault();
                        localStorage.setItem('userName', userName); // <== almacenamiento en "local storage" del nombre de usuario conectado

                        socket.emit('newUser', { userName, socketID: socket.id }); // <<==  sends the username and socket ID to the Node.js server
                        navigate('/chat');   //  <== ir a la pagina de "chat" de la aplicacion. La API imperativa de React Router "navigate(ruta)
                                            // permite navegar mediante programación (cambia la ubicación actual cuando se representa.)
                      };


                    return (...)
                          ...

          5.2.-  En el backend, servidor SocketIO:  Crear un "detector de eventos" de nuevos usuarios en el chat.

                 Actualizacion de la matriz de usuarios activos (activ users) en el servidor Node.js.  Crear un evento que cada vez que un
                 usuario se una o abandone la aplicación de chat avise.

                    let usersActivInChat = [];  //  <<==  Array of Activ users in the chat application


                    // Method "on" form Socket IO Server.  Nota.-  Add this before the app.get() block
                    socketIO.on('connection', (socket) => {
                      //  Conection with socket.io
                      console.log(`⚡ : ${socket.id} user just connected!  `.bgRed);  //  <<==  Creation of a "unique id" for the user logged on via socket
                      socket.on('message', (data) => {
                        socketIO.emit('messageResponse', data);
                      });

                      //Listens when a new user joins the server
                      socket.on('newUser', (data) => {
                        //Adds the new user to the list of users activ in the chat ("usersActivInChat")
                        usersActivInChat.push(data);
                        // console.log(users);
                        //Sends the list of users to the client
                        socketIO.emit('newUserResponse', usersActivInChat);
                      });

                      //  Disconnected with socket.io
                      socket.on('disconnect', () => {
                        console.log('🔥: A user disconnected'.bgWhite);  //  <<==  User information disconnected by the socket disconnection event
                        //Updates the list of usersActivInChat when a user disconnects from the server
                        usersActivInChat = usersActivInChat.filter((user) => user.socketID !== socket.id);
                        // console.log(usersActivInChat);
                        //Sends the list of users to the client
                        socketIO.emit('newUserResponse', usersActivInChat);
                        socket.disconnect();
                      });
                    });


                El evento "newuser":  socket.on("newUser") se activara cuando un nuevo usuario se une a la aplicación de chat.
                Los detalles del usuario (ID de socket y nombre de usuario) se guardan en el array de usuarios activos
                conectados a la aplicacion:  "usersActivInChat", y se enviara de regreso a la aplicación React en un nuevo evento
                llamado: "newUserResponse".

                En socket.io ("disconnect"), el array de usuarios activos conectados: "usersActivInChat" se actualiza cuando un
                usuario abandona la aplicación de chat y el evento "newUserReponse" se activa para enviar la lista actualizada
                de usuarios al cliente (usersActivInChat)


          5.3.- Monstar los usuarios activos (actualizados) en el componente ChatBar.jsx

                Actualizar la interfaz de usuario, ChatBar.js, para mostrar la lista de usuarios activos (siempre actualizada).


                    import React, { useState, useEffect } from 'react';


                    function ChatBar({ socket }) {
                      const [usersActivInChat, setUsersActivInChat] = useState([]);

                      //  Actalizacion de la lista de usuarios mostrada por el componente, cada vez que cambia el estado del
                      //  socket o la lista de usuarios activos
                      useEffect(() => {
                        socket.on('newUserResponse', (data) => setUsersActivInChat(data));
                      }, [socket, users]);


                      return (
                        <div className="chat__sidebar">
                          <h2>Open Chat</h2>
                          <div>
                            <h4 className="chat__header">ACTIVE USERS</h4>
                            <div className="chat__users">
                              {users.map((user) => (
                                <p key={user.socketID}>{user.userName}</p>
                              ))}
                           </div>
                          </div>
                        </div>
                      );
                    };

                    export default ChatBar;


                El Hook useEffect "escucha" (socket.on) la respuesta enviada desde el servidor Node.js (newuserResponse?) y recopila
                la lista de usuarios activos ("usersActivInChat"). La lista se asigna a la vista y se actualiza en tiempo real.


      Felicitaciones 💃🏻, ya se puede obtener la lista de usuarios activos de Socket.io.



      6.-  Desplazamiento automático de pantalla con nuevo mensaje.

      6.1.-  Función de desplazamiento automático de la pantalla cuando se recibe un nuevo mensaje.

            En el componente "ChatPage.jsx" modificar:


                import React, { useEffect, useState, useRef } from 'react';
                import ChatBar from '../components/ChatBar.jsx';
                import ChatBody from '../components/ChatBody.jsx';
                import ChatFooter from '../components/ChatFooter.jsx';

                //  In the Socket.io client ("Chatpage.jsx" component), it "listens" for messages sent through the "messageResponse" event
                //  event and distributes the data in the message array (arrayMessages). The "arrayMessages" is passed to the
                //  ChatBody.jsx" component to be displayed in the user interface.


                function ChatPage({ socket }) {
                  const [messages, setMessages] = useState([]);
                  const [typingStatus, setTypingStatus] = useState('');
                  const lastMessageRef = useRef(null);

                  // Every time a new message arrives on the socket (listener event "messageResponse") from the server SocketIO,
                  // listen (socket.io method) shows it on screen (send to ChatBody.jsx component)

                  useEffect(() => {
                    socket.on('messageResponse', (data) => setMessages([...messages, data]));
                  }, [socket, messages]);

                  useEffect(() => {
                    // 👇️ scroll to bottom every time messages change
                    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, [messages]);


                  return (
                    <div className="chat">
                      <ChatBar socket={socket} />
                      <div className="chat__main">
                        <ChatBody messages={messages} lastMessageRef={lastMessageRef} />
                        <ChatFooter socket={socket} />
                      </div>
                    </div>
                  );
                };

                export default ChatPage;


            En el componente "ChatBody.jsx" modificar para que contenga un elemento para "lastMessageRef".

                import React from 'react';
                import { useNavigate } from 'react-router-dom';


                function ChatBody({ messages, userName, lastMessageRef }) {
                  const navigate = useNavigate();

                  //  Delete active user passed as "prop" (userName) from the list of active users. Switch to chat homepage and reload.
                  const handleLeaveChat = () => {
                    localStorage.removeItem('userName');  //  <<== If the connected user data is deleted in "local storage", a console message will be displayed in the backend.
                    navigate('/');
                    window.location.reload();
                  };

                  return (
                    <>
                      <div>
                          ......
                          {/ * --- At the bottom of the JSX element ----* /}
                          <div ref={lastMessageRef} />
                      </div>
                    </>
                  );
                };

                export default ChatBody;


            De los fragmentos de código anteriores, la "referencia": "lastMessageRef" se adjunta a una etiqueta "div" en la parte
            inferior de los mensajes, y su hook useEffect (en el componente "ChatPage.jsx") tiene una sola dependencia, que es la
            matriz de mensajes "messages". Entonces, cuando los mensajes cambian, useEffect para los lastMessageRef re-renderizados.


      7.-  Notificacion de usuario escribiendo.

           Para notificar a los usuarios cuando un determinado usuario está escribiendo, usaremos el "onKeyDowndetector" de eventos
           de JavaScript en el campo de entrada, que activa una función que envía un mensaje a Socket.io como se muestra a
           continuación:

      7.1.-  En el componente "ChatFooter.jsx" anadir funcion "handleTyping": activacion por el evento "typing" cada vez que un
                                                                              usuario escribe en el campo de texto (input type="text")

                                                                              escribe:  `${localStorage.getItem('userName')} is typing`

              import React, { useState } from 'react';

              function ChatFooter({ socket }) {
                const [message, setMessage] = useState('');

                //  Activacion del evento "typing" cada vez que un usuario escribe en el campo de texto (input type="text")
                const handleTyping = () => {
                  socket.emit('typing', `${localStorage.getItem('userName')} is typing`);
                }

                const handleSendMessage = (ev) => {
                  ev.preventDefault();
                  console.log('userName:  ', localStorage.getItem('userName'), 'message:  ', message);

                  //  If the message is not "empty" (not '') and there is a user name "stored" in "Local Storage".
                  //  If true   => message" entered in the input, with "socket.emit".
                  //  If false  => pongo el mensaje (message) a ""
                  if (message.trim() !== '' && localStorage.getItem('userName')) {
                    socket.emit('message', {
                      text: message,
                      name: localStorage.getItem('userName'),
                      id: `${socket.id}${Math.random()}`,
                      socketID: socket.id,
                    });
                  }
                  setMessage('');
                };


                return (
                  <div className="chat__footer">
                    <form className="form" onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        placeholder="Write message"
                        className="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        {/*OnKeyDown function * /}
                        onKeyDown={handleTyping}
                      />
                      <button className="sendBtn">SEND</button>
                    </form>
                  </div>
                );
              };

              export default ChatFooter;


          Desde el fragmento de código anterior, la funcion: "handleTyping" activa el evento "typing" cada vez que un usuario
          escribe en su campo de texto. Luego, podemos escuchar el evento de escritura en el servidor, y enviar una respuesta
          que contenga los datos a otros usuarios a través de otro evento llamado: "typingResponse".


    7.2.- En el archivo "server.js" del backend: add EventListener en el servidor socketIO (lee evento 'typing' y responde a
                                                 todos los usuarios enviandoles los datos y con el evento 'typingResponse')

              socketIO.on('connection', (socket) => {
                // console.log(`⚡: ${socket.id} user just connected!`);
                // socket.on('message', (data) => {
                //   socketIO.emit('messageResponse', data);
              // });

              //  EventListener en el servidor SocketIO (server.js).  Si se produce el evento "typing" el servidor socketIO
              //  respondera emitiendo a tosos los uausrios activos conectados de la aplicacion (mediante socket.broadcast.emit)
              //  con otro evento:  "typingResponse", enviando los datos "data" a los usuarios conectados.
              socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

              // socket.on('newUser', (data) => {
              //   users.push(data);
              //   socketIO.emit('newUserResponse', users);
              // });

              // socket.on('disconnect', () => {
              //   console.log('🔥: A user disconnected');
              //   users = users.filter((user) => user.socketID !== socket.id);
              //   socketIO.emit('newUserResponse', users);
              //   socket.disconnect();
            // });
            });


    7.3.- En el componente "ChatPage.jsx" de la aplicacion React: escribir codigo para escuchar el nuevo evento emitido por el 
                                                                  server socket, y enviar los datos recibidos al componente 
                                                                  "ChatBody.jsx"


              import React, { useEffect, useState, useRef } from 'react';
              import ChatBar from '../components/ChatBar.jsx';
              import ChatBody from '../components/ChatBody.jsx';
              import ChatFooter from '../components/ChatFooter.jsx';

              //  1.- In the Socket.io client ("ChatPage.jsx" component), it "listens" for messages sent through the "messageResponse"
              //  event and distributes the data in the message array (arrayMessages). The "arrayMessages" is passed to the 
              //  ChatBody.jsx" component to be displayed in the user interface.

              //  2.- In the Socket.io client ("ChatPage.jsx" component), it "listens" too the event "typingResponse" with the "data"
              //      recived and distributes those data to the component "ChatBody" for renden and to be displayed in the user interface.

              const ChatPage = ({ socket }) => {
                // const [messages, setMessages] = useState([]);
                // const [typingStatus, setTypingStatus] = useState('');
                // const lastMessageRef = useRef(null);

                // Every time a new message arrives on the socket (listener event "messageResponse") from the server SocketIO, 
                // listen (socket.io method) shows it on screen (send to ChatBody.jsx component)

                useEffect(() => {
                  socket.on('messageResponse', (data) => setMessages([...messages, data]));
                }, [socket, messages]);

                useEffect(() => {
                  // 👇️ scroll to bottom every time messages change
                  lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, [messages]);

                //  Listen the new event "typingResponse" from server socketIO, and send the data received from server to "ChatBody.jsx"
                useEffect(() => {
                  socket.on('typingResponse', (data) => setTypingStatus(data));
                }, [socket]);

                return (
                  <div className="chat">
                    <ChatBar socket={socket} />
                    <div className="chat__main">
                      <ChatBody
                        messages={messages}
                        typingStatus={typingStatus}
                        lastMessageRef={lastMessageRef}
                      />
                      <ChatFooter socket={socket} />
                    </div>
                  </div>
                );
              };

              export default ChatPage;



    7.4.-  En el componente "ChatBody.jsx": con codigo para mostrar el "estado de escritura" a los usuarios activos del chat.


              //  Set state variable "isTyping" with data of prop "typingStatus"
              useEffect(() => {
                setIsTyping(typingStatus)
              }, [typingStatus]);

              //  Reset of information of status typing
              useEffect(() => {
                setIsTyping('')
              }, [messages])

              ...
              <div className="message__status">
                <br />
                <p>{typingStatus}</p>
              </div>


    ¡Felicidades, acabas de crear una aplicación de chat!💃🏻

    Siéntase libre de mejorar la aplicación agregando la función de mensajería privada de Socket.io que permite a los usuarios crear
    "salas de chat privadas"  y  "mensajería directa", utilizando una biblioteca de autenticación para la autorización y autenticación
    del usuario y una base de datos en tiempo real para el almacenamiento.


    Conclusión.

    "Socket.io" es una gran herramienta con excelentes funciones que nos permite crear aplicaciones eficientes en tiempo real,
    como sitios web de apuestas deportivas, aplicaciones de subastas y comercio de divisas y, por supuesto, aplicaciones de chat
    mediante la creación de conexiones duraderas entre los navegadores web y un servidor Node.js.
*/




//      Library Socket.io
/*
        Socket.IO es una biblioteca de javascript que permite la "comunicación de baja latencia", "comunicacion bidireccional" en tiempo real y
        "basada en eventos" entre un cliente (browser) y un servidor (NodeJS).


        ||  Client  ||  <<  =====   Comunicacion Bidireccional  ====  >>  ||  Server   ||

        Es una biblioteca "confiable" y de "alto rendimiento", optimizada para procesar un gran volumen de datos con un retraso mínimo (baja latancia).

        Se basa en el protocolo de comunicacion "WebSocket" y proporciona mejores funcionalidades, como el respaldo al sondeo largo HTTP (HTTP long-polling )
        o la reconexión automática, lo que nos permite crear aplicaciones de chat y en tiempo real "eficientes".

        INFORMACIÓN:  "WebSocket" es un protocolo de comunicación que proporciona un "canal full-duplex" y de baja latencia, entre el servidor y el navegador.

        Hay varias implementaciones de servidor Socket.IO disponibles.




        Ejemplo:  aquí hay un ejemplo básico con WebSockets simples:

                  Servidor (basado en ws )

                  import { WebSocketServer } from "ws";

                  const server = new WebSocketServer({ port: 3000 });

                  server.on("connection", (socket) => {
                    // send a message to the client
                      socket.send(JSON.stringify({
                        type: "hello from server",
                        content: [ 1, "2" ]
                      }));

                    // receive a message from the client
                      socket.on("message", (data) => {
                        const packet = JSON.parse(data);

                          switch (packet.type) {
                            case "hello from client":
                            // ...
                            break;
                            }
                          });
                    });

                  Cliente:

                  const socket = new WebSocket("ws://localhost:3000");

                  socket.addEventListener("open", () => {
                    // send a message to the server
                    socket.send(JSON.stringify({
                      type: "hello from client",
                      content: [ 3, "4" ]
                    }));
                  });

                  // receive a message from the server
                  socket.addEventListener("message", ({ data }) => {
                    const packet = JSON.parse(data);

                    switch (packet.type) {
                      case "hello from server":
                      // ...
                      break;
                    }
                  });


        Y aquí está el mismo ejemplo con Socket.IO:

            Servidor:  import "Serbver" del paquete "socket.io", crear un nuevo servidor socket (new Server(PORT)), creo un "on"

              import { Server } from "socket.io";

              const io = new Server(3000);

              io.on("connection", (socket) => {
                // send a message to the client
                socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });

                // receive a message from the client
                socket.on("hello from client", (...args) => {
                  // ...
                });
              });

            Cliente:

import { io } from "socket.io-client";

const socket = io("ws://localhost:3000");

// send a message to the server
socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

// receive a message from the server
socket.on("hello from server", (...args) => {
  // ...
});

Ambos ejemplos parecen muy similares, pero bajo el capó, Socket.IO proporciona funciones adicionales que ocultan la complejidad de ejecutar una aplicación basada en WebSockets en producción.

Socket.IO NO es una implementación de WebSocket.

Aunque Socket.IO de hecho usa WebSocket para el transporte cuando es posible, agrega metadatos adicionales a cada paquete. Es por eso que un cliente WebSocket no podrá conectarse con éxito a un servidor Socket.IO, y un cliente Socket.IO tampoco podrá conectarse a un servidor WebSocket normal.

// WARNING: the client will NOT be able to connect!
const socket = io("ws://echo.websocket.org");

Si está buscando un servidor WebSocket simple, eche un vistazo a ws o µWebSockets.js .

También hay discusiones para incluir un servidor WebSocket en el núcleo de Node.js.

En el lado del cliente, es posible que le interese el paquete robusto-websocket .

PRECAUCIÓN
Socket.IO no está destinado a ser utilizado en un servicio en segundo plano para aplicaciones móviles.

La biblioteca Socket.IO mantiene una conexión TCP abierta con el servidor, lo que puede resultar en un alto consumo de batería para sus usuarios. Utilice una plataforma de mensajería dedicada como FCM para este caso de uso.

Estas son las características proporcionadas por Socket.IO sobre WebSockets simples:

 de sondeo largo de HTTP
La conexión recurrirá al sondeo largo HTTP en caso de que no se pueda establecer la conexión WebSocket.

Esta característica fue la razón número 1 por la que la gente usó Socket.IO cuando se creó el proyecto hace más de diez años (!), ya que el soporte del navegador para WebSockets aún estaba en pañales.

Incluso si la mayoría de los navegadores ahora son compatibles con WebSockets (más del 97 % ), sigue siendo una gran característica, ya que aún recibimos informes de usuarios que no pueden establecer una conexión WebSocket porque están detrás de algún proxy mal configurado.

 automática
Bajo algunas condiciones particulares, la conexión WebSocket entre el servidor y el cliente puede interrumpirse sin que ambos lados se den cuenta del estado roto del enlace.

Es por eso que Socket.IO incluye un mecanismo de latido, que verifica periódicamente el estado de la conexión.

Y cuando el cliente finalmente se desconecta, se vuelve a conectar automáticamente con un retraso exponencial, para no abrumar al servidor.

 de paquetes
Los paquetes se almacenan automáticamente en el búfer cuando el cliente se desconecta y se enviarán cuando se vuelva a conectar.

Más información aquí .

Socket.IO proporciona una forma conveniente de enviar un evento y recibir una respuesta:

Remitente

socket.emit("hello", "world", (response) => {
  console.log(response); // "got it"
});

Receptor

socket.on("hello", (arg, callback) => {
  console.log(arg); // "world"
  callback("got it");
});

También puede agregar un tiempo de espera:

socket.timeout(5000).emit("hello", "world", (err, response) => {
  if (err) {
    // the other side did not acknowledge the event in the given delay
  } else {
    console.log(response); // "got it"
  }
});

Del lado del servidor, puede enviar un evento a todos los clientes conectados o a un subconjunto de clientes :

// to all connected clients
io.emit("hello");

// to all connected clients in the "news" room
io.to("news").emit("hello");

Esto también funciona cuando se escala a múltiples nodos .

Los espacios de nombres le permiten dividir la lógica de su aplicación en una única conexión compartida. Esto puede ser útil, por ejemplo, si desea crear un canal "administrador" al que solo puedan unirse los usuarios autorizados.

io.on("connection", (socket) => {
  // classic users
});

io.of("/admin").on("connection", (socket) => {
  // admin users
});

Más sobre eso aquí .

 comunes
¿Todavía se necesita Socket.IO hoy
Esa es una pregunta justa, ya que los WebSockets ahora son compatibles en casi todas partes .

Dicho esto, creemos que, si usa WebSockets simples para su aplicación, eventualmente necesitará implementar la mayoría de las funciones que ya están incluidas (y probadas en batalla) en Socket.IO, como reconexión , reconocimientos o transmisión .

¿Cuál es la sobrecarga del protocolo Socket.IO
socket.emit("hello", "world")se enviará como un único marco WebSocket que contiene 42["hello","world"]:

4siendo Engine.IO tipo de paquete "mensaje"
2siendo el tipo de paquete Socket.IO "mensaje"
["hello","world"]siendo la JSON.stringify()versión -ed de la matriz de argumentos
Por lo tanto, unos pocos bytes adicionales para cada mensaje, que pueden reducirse aún más mediante el uso de un analizador personalizado .

INFORMACIÓN
El tamaño del paquete del navegador en sí es 10.4 kB(minimizado y comprimido con gzip).
*/


//   Emitiendo eventos con "socket.io"
/*
     Hay varias formas de enviar eventos entre el servidor y el cliente en "socket.io"

    1.-  Envio de eventos "básica"

         La API de Socket.IO está inspirada en "Node.js EventEmitter", lo que significa que puede emitir eventos en un lado y registrar oyentes en el otro:

            // server-side
            io.on("connection", (socket) => {
              socket.emit("hello", "world");
            });

            // client-side
            socket.on("hello", (arg) => {
              console.log(arg); // world
            });

         Esto también funciona en la otra dirección:

          // server-side
          io.on("connection", (socket) => {
             socket.on("hello", (arg) => {
               console.log(arg); // world
             });
          });

          // client-side
          socket.emit("hello", "world");

        Puede enviar cualquier número de argumentos y se admiten todas las estructuras de datos serializables, incluidos objetos binarios como Buffer o 
        TypedArray.

        // server-side
        io.on("connection", (socket) => {
          socket.emit("hello", 1, "2", { 3: '4', 5: Buffer.from([6]) });
        });

        // client-side
        socket.on("hello", (arg1, arg2, arg3) => {
          console.log(arg1); // 1
          console.log(arg2); // "2"
          console.log(arg3); // { 3: '4', 5: ArrayBuffer (1) [ 6 ] }
        });

        No hay necesidad de ejecutar objetos "JSON.stringify()" ya que se hará por usted.

        // BAD
        socket.emit("hello", JSON.stringify({ name: "John" }));

        // GOOD
        socket.emit("hello", { name: "John" });

      Nota: Map y Set no son serializables y deben serializarse manualmente:

            const serializedMap = [...myMap.entries()];
            const serializedSet = [...mySet.keys()];


Los eventos son excelentes, pero en algunos casos es posible que desee una API de solicitud y respuesta más clásica. En Socket.IO, esta función se denomina acuse de recibo.

Puede agregar una devolución de llamada como el último argumento de emit(), y esta devolución de llamada se llamará una vez que el otro lado reconozca el evento:

// server-side
io.on("connection", (socket) => {
  socket.on("update item", (arg1, arg2, callback) => {
    console.log(arg1); // 1
    console.log(arg2); // { name: "updated" }
    callback({
      status: "ok"
    });
  });
});

// client-side
socket.emit("update item", "1", { name: "updated" }, (response) => {
  console.log(response.status); // ok
});

El tiempo de espera no se admite de forma predeterminada, pero es bastante sencillo de implementar:

const withTimeout = (onSuccess, onTimeout, timeout) => {
  let called = false;

  const timer = setTimeout(() => {
    if (called) return;
    called = true;
    onTimeout();
  }, timeout);

  return (...args) => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    onSuccess.apply(this, args);
  }
}

socket.emit("hello", 1, 2, withTimeout(() => {
  console.log("success!");
}, () => {
  console.log("timeout!");
}, 1000));

 volátiles
Los eventos volátiles son eventos que no se enviarán si la conexión subyacente no está lista (un poco como UDP , en términos de confiabilidad).

Esto puede ser interesante, por ejemplo, si necesita enviar la posición de los personajes en un juego en línea (ya que solo los valores más recientes son útiles).

socket.volatile.emit("hello", "might or might not be received");

Otro caso de uso es descartar eventos cuando el cliente no está conectado (de forma predeterminada, los eventos se almacenan en búfer hasta la reconexión).

Ejemplo:

// server-side
io.on("connection", (socket) => {
  console.log("connect");

  socket.on("ping", (count) => {
    console.log(count);
  });
});

// client-side
let count = 0;
setInterval(() => {
  socket.volatile.emit("ping", ++count);
}, 1000);

Si reinicias el servidor, verás en la consola:

connect
1
2
3
4
# the server is restarted, the client automatically reconnects
connect
9
10
11

Sin la volatilebandera, verías:

connect
1
2
3
4
# the server is restarted, the client automatically reconnects and sends its buffered events
connect
5
6
7
8
9
10
11



*/


