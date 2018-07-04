// Import everything from express and assign it to the express variable
import * as bodyParser from "body-parser";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import { Server as HttpServer } from "http";
import * as methodOverride from "method-override";
const app = express();

const server = new HttpServer(app);

const io = require("socket.io")(server);

app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride("X-HTTP-Method-Override"));

/**
 * Listen on provided port, on all network interfaces.
 */
const port = 5555;

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
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
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

const getColors = () => {
  const colors = `${__dirname}/colors.json`;
  const exists = fs.existsSync(colors);
  if (!exists) fs.writeFileSync(colors, JSON.stringify({ version: "0.0.1" }));

  let text = fs.readFileSync(colors).toString("utf8");
  return JSON.parse(text);
};
app.get("*", (req: Request, res: Response, next: NextFunction) => {
  let result = getColors();
  res.send(result);
});
app.get("/api/colors", (req: Request, res: Response, next: NextFunction) => {
  let result = getColors();
  res.send(result);
});

// set the static files location /public/img will be /img for users

app.use(express.static("dist"));

server.listen(port, () => {
  console.log("listening on " + port);
});
