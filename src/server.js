//-- No tiene WebSocket funcional por usar Cluster --//
require("dotenv").config({ override: true });
//const fn_set_expired_lifetime = require("@tasks/fn_set_expired_lifetime");
//const fn_sendemail = require("@tasks/fn_sendemail");
const { pgWebPush } = require("@app_express_routes/webpush.js");
const cluster = require("cluster");

//import * as sio from "socket.io";
import * as sapper from "@sapper/server";
import sirv from "sirv";
import compression from "compression";
import virtual_route from "@app_express_routes/routes";
import fs from "fs";


var ExpiredEventsRunning = false;
var SendEmailRunning = false;
global.fecha = new Date();
var ListSockets = [];

// Para generar los certificados correr el siguiente comando, completar los datos que solicita y copiar los dos archivos que se generan
// openssl req -x509 -nodes -days 1825 -newkey rsa:2048 -keyout selfsigned.key -out selfsigned.crt
var privateKey = fs.readFileSync("./certs/selfsigned.key", "utf8");
var certificate = fs.readFileSync("./certs/selfsigned.crt", "utf8");
var credentials = { key: privateKey, cert: certificate, requestCert: false };

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
//process.env.LOCAL_SERVER = true;


// Esto es para que se ejecute solo en el master y no en los workers
if (cluster.isMaster) {
  require("@telegraf/telegraf.js");

  new pgWebPush();

  /*
  setInterval(() => {
    if (!SendEmailRunning) {
      SendEmailRunning = true;
      fn_sendemail()
        .then((ret) => {
          console.log("fn_sendemail End", ret);
          SendEmailRunning = false;
        })
        .catch((e) => {
          console.log("fn_sendemail Error", e);
          SendEmailRunning = false;
        });
    } else {
      console.log("fn_sendemail Running...");
    }
  }, 1000 * 300);
*/

  setInterval(() => {
    /*
    if (!ExpiredEventsRunning) {
      ExpiredEventsRunning = true;
      fn_set_expired_lifetime()
        .then((ret) => {
          console.log("ExpiredEvents Running", ret);
          ExpiredEventsRunning = false;
        })
        .catch((e) => {
          console.log("ExpiredEvents Running Error", e);
          ExpiredEventsRunning = false;
        });
    } else {
      console.log("ExpiredEvents Running...");
    }
    */
  }, 300 * 1000);
}

if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require("os").cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  const app = express(); //instancia de express
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ strict: false, limit: 50000000 })); //-- Limit 50M
  app.use(cookieParser());
  app.use(compression());
  app.use(virtual_route);
  app.use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  );

  console.log(process.env.LOCAL_SERVER, process.env.DATABASE_URL);

  let httpServer;

  if (!process.env.LOCAL_SERVER) {
    httpServer = require("http").createServer(app);
    console.log('Usando HTTP');
    
  } else {
    httpServer = require("https").createServer(credentials, app);
    console.log('Usando HTTPS');
  }

  let io = require("socket.io")(httpServer);

  
  /*
  io.use((socket, next) => {
    console.log(socket);
    next();
  });
*/

  //io.listen();
  io.on("error", (e) => {
    console.trace(e);
  });

  io.on("connection", (socket) => {
    io.emit("chat", "Bienvenido " + socket.id);

    setInterval(() => {
      io.emit("chat", new Date() + " - " + socket.id);
    }, 10 * 1000);
  });

  httpServer.on("error", (e) => {
    console.trace(e);
  });

  httpServer.listen(PORT, () => {
    console.log("App listening on port " + PORT + " " + cluster.worker.id);
  });
}

// Listen for dying workers
cluster.on("exit", function (worker) {
  // Replace the dead worker,
  // we're not sentimental
  console.log("Worker %d died :(", worker.id);
  cluster.fork();
});


//Formato de mensajes que se deben enviar desde ESP32 42["chat",{"id": "67", "name": "p"}]