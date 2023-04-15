//      Library Socket.io
/*
        Socket.IO es una biblioteca de javascript que permite la "comunicación duplex de baja latencia", "comunicacion bidireccional" en tiempo 
        real y "basada en eventos" entre un cliente (browser) y un servidor (NodeJS).

        ||  Client  ||  <<  =====   Comunicacion Bidireccional Duplex  ====  >>  ||  Server   ||


        Es una biblioteca "confiable" (??) y de "alto rendimiento", optimizada para procesar un gran volumen de datos de comunicacion y mensajes 
        con un retraso mínimo (baja latencia).  Hay varias implementaciones de servidor Socket.IO disponibles.

        Se basa en el protocolo de comunicacion "WebSocket", y proporciona mejores funcionalidades que este, como el respaldo al sondeo largo HTTP
        (HTTP long-polling ) o la reconexión automática, lo que nos permite crear aplicaciones de chat y en tiempo real "eficientes".

        INFORMACIÓN: "WebSocket" es un "protocolo de comunicación" que proporciona un "canal full-duplex" y de baja latencia, entre un servidor de 
        WebSocket y distintos clientes browsers.


        Ejemplo:  aquí hay un "ejemplo básico" con WebSockets simples:

                  1.-  Servidor (basado en ws)
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


                  2.- Cliente: un browser client
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

            1.- Servidor:  import "Server" del paquete "socket.io", crear un nuevo servidor socket (new Server(PORT)), creo un "on"

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


            2.- Cliente: un browser cliente socket.io

            import { io } from "socket.io-client";

            const socket = io("ws://localhost:3000");

            // send a message to the server
            socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

            // receive a message from the server
            socket.on("hello from server", (...args) => {
            // ...
            });

      Ambos ejemplos parecen muy similares, pero bajo el capó, "Socket.IO" proporciona "funciones adicionales" que ocultan la complejidad 
      de ejecutar una aplicación basada en WebSockets en producción.


    1.-  "Socket.IO" NO es una implementación de WebSocket.

    Aunque "Socket.IO" de hecho usa WebSocket para el transporte cuando es posible, agrega "metadatos adicionales" a cada paquete. 
    Es por eso que un cliente WebSocket "no" podrá conectarse con éxito a un servidor Socket.IO, y un cliente Socket.IO tampoco podrá 
    conectarse a un servidor WebSocket normal.


    // WARNING: the client will NOT be able to connect!
    const socket = io("ws://echo.websocket.org");


    Nota.-  Si está buscando un "servidor WebSocket" simple, eche un vistazo a ws o µWebSockets.js .

    Nota.-  También hay discusiones para incluir un servidor WebSocket en el núcleo de Node.js.

    En el lado del cliente, es posible que le interese el paquete robusto-websocket .


    PRECAUCIÓN: Socket.IO no está destinado a ser utilizado en un servicio en segundo plano para aplicaciones móviles.

    La biblioteca Socket.IO mantiene una "conexión TCP abierta" con el servidor, lo que puede resultar en un alto consumo de batería para 
    sus usuarios. Utilice una plataforma de mensajería dedicada como FCM para este caso de uso.


    2.-  Características proporcionadas por Socket.IO sobre WebSockets simples

          -  La conexión recurrirá al "sondeo largo HTTP" en caso de que no se pueda establecer la "conexión WebSocket".

             Esta característica fue la razón número 1 por la que la gente usó Socket.IO cuando se creó el proyecto hace más de diez años (!), 
             ya que el soporte del navegador para WebSockets aún estaba en pañales.

            Incluso si la mayoría de los navegadores ahora son compatibles con WebSockets (más del 97 % ), sigue siendo una gran característica, 
            ya que aún recibimos informes de usuarios que no pueden establecer una conexión WebSocket porque están detrás de algún proxy mal 
            configurado.

 
          -  Automátismo de "latido" de conexiones (verificacion de las conexiones de socketIO, reconexion automatica de conexiones perdidas)

             Bajo algunas condiciones particulares, la conexión WebSocket entre el servidor y el cliente puede interrumpirse sin que ambos lados 
             se den cuenta del estado roto del enlace.

             Es por eso que Socket.IO incluye un "mecanismo de latido", que verifica periódicamente el estado de la conexión.

             Y cuando el cliente finalmente se desconecta, se vuelve a "conectar automáticamente" con un retraso exponencial, para no abrumar al 
             servidor.


          -  Paquetes de socketIO almacenados automaticamente en "buffer"

             Los paquetes se almacenan automáticamente en el búfer cuando el cliente se desconecta y se enviarán cuando se vuelva a conectar.


    3.-  Envio de "eventos" de comunicacion socketIO y tratamiento de respuestas.

        Socket.IO proporciona una forma conveniente de enviar un evento y recibir una respuesta:

          A.-  Remitente: el que envia datos a partir de diferentes "eventos" de comunicacion

            socket.emit("hello", "world", (response) => {
              console.log(response); // "got it"
            });


          B.-  Receptor: elq ue recibe los datos emitidos, y tratamiento de la respuesta de comunicacion

            socket.on("hello", (arg, callback) => {
              console.log(arg); // "world"
              callback("got it");
            });


        También se puede agregar un "tiempo de espera":

          socket.timeout(5000).emit("hello", "world", (err, response) => {
            if (err) {
              // the other side did not acknowledge the event in the given delay
            } else {
              console.log(response); // "got it"
            }
          });


        Del lado del servidor, se puede enviar un evento a todos los clientes conectados (broadcasting) o a un subconjunto de clientes:

          // to all connected clients
          io.emit("hello");

          // to all connected clients in the "news" room
          io.to("news").emit("hello");


        Esto también funciona cuando se escala a múltiples nodos .

        Los espacios de nombres le permiten dividir la lógica de su aplicación en una única conexión compartida. Esto puede ser útil, 
        por ejemplo, si desea crear un canal "administrador" al que solo puedan unirse los usuarios autorizados.

          io.on("connection", (socket) => {
            // classic users
          });

          io.of("/admin").on("connection", (socket) => {
            // admin users
          });



      ¿Todavía se necesita Socket.IO hoy?  Esta es una pregunta justa, ya que los WebSockets ahora son compatibles en casi todas partes .

      Dicho esto, creemos que, si usa WebSockets simples para su aplicación, eventualmente necesitará implementar la mayoría de las funciones 
      que ya están incluidas (y probadas en batalla) en Socket.IO, como "reconexión", "reconocimientos" o "transmisión".

      ¿Cuál es la sobrecarga del protocolo Socket.IO? socket.emit("hello", "world") se enviará como un único marco WebSocket que 
      contiene 42["hello","world"]:

        4 => siendo Engine.IO tipo de paquete "mensaje"
        2 => siendo el tipo de paquete Socket.IO "mensaje"

        ["hello","world"] => siendo la version "JSON.stringify()"" -ed de la matriz de argumentos.

      Por lo tanto, unos pocos bytes adicionales para cada mensaje, que pueden reducirse aún más mediante el uso de un analizador personalizado.

      INFORMACIÓN:  El tamaño del paquete del navegador en sí es 10.4 kB (minimizado y comprimido con gzip).
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


