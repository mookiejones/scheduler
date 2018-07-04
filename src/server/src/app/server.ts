/* app/server.ts */

// Import everything from express and assign it to the express variable
import * as bodyParser from "body-parser";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import * as methodOverride from "method-override";
// Import APIController from controllers entry point
import { APIController } from "./controllers";

export class Server {
  public set(setting: string, value: any) {
    this.app.set(setting, value);
  }

  app: express.Application;
  constructor() {
    // Create a new express application instance
    this.app = express();

    this.config();

    this.routes();

    this.api();
  }

  config() {
    /** Get All Data/Stuff of the body (POST) parameters
/* Parse Application/JSON
*/
    this.app.use(bodyParser.json());

    // parse application/vnd.api+json as json
    this.app.use(bodyParser.json({ type: "application/vnd.api+json" }));

    // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    this.app.use(methodOverride("X-HTTP-Method-Override"));
  }

  routes() {}

  api() {
    // Mount the WelcomeController at the /welcome route
    this.app.use("/api", APIController);
    this.app.get("*", (req: Request, res: Response, next: NextFunction) => {
      console.log("Any Request");
      debugger;
    });
    this.app.get(
      "/api/colors",
      (req: Request, res: Response, next: NextFunction) => {
        debugger;
        console.log("Color Request");
      }
    );

    // set the static files location /public/img will be /img for users

    // app.use(express.static("dist"));

    // catch 404 and forward to error handler
    this.app.use(function(req: Request, res: Response, next: NextFunction) {
      console.log("wtf");
      next(createError(404));
    });

    // error handler
    this.app.use(function(
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      console.log("there was an error");
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });
  }
}
