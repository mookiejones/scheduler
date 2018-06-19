/* app/server.ts */

// Import everything from express and assign it to the express variable
import * as express from "express";

import { Router, Request, Response, NextFunction, Application } from "express";
import createError from "http-errors";

import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as methodOverride from "method-override";
import * as http from "http";
import { readFileSync } from "fs";

const debug = require("debug")("react-backend:server");

const getKeyFile = (name: string) => readFileSync(`${process.cwd()}/${name}`);

const options = {
  key: getKeyFile("server.key"),
  cert: getKeyFile("server.crt")
};

// Import APIController from controllers entry point
import { HomeController, APIController } from "./controllers";
import { Socket } from "net";

// Create a new express application instance
const app: express.Application = express();

const normalizePort = (val: number | string): number | string | boolean => {
  let port: number = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
};

// Mount the WelcomeController at the /welcome route
app.use("/api", APIController);
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  debugger;
});

const port = normalizePort(process.env.PORT || 8080);
app.set("port", port);

/** Get All Data/Stuff of the body (POST) parameters
/* Parse Application/JSON
*/
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride("X-HTTP-Method-Override"));

// set the static files location /public/img will be /img for users

app.use(express.static("dist"));

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use(logger("dev"));
app.use(cookieParser());

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

server.on("close", () => {
  console.log("server closed");
});
server.on("connection", (listener: Socket) => {
  debugger;
});

server.on("error", onError);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
  debug("Listening on " + bind);
}
