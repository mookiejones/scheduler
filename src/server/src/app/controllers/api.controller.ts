/* app/routes/api.ts */

// Import only what we need from express

import { NextFunction, Request, Response, Router } from "express";
import * as fs from "fs";
// Assign router to the express.Router() instance;

const router: Router = Router();

// The / here corresponds to the route that the WelcomeController
// is mounted on in the server.ts file.
// In this case it's /welcome
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  // Reply with a hello world when no name param is provided
  console.info("request" + req.originalUrl);
  next();
});

router.get("style-codes", (req: Request, res: Response, next: NextFunction) => {
  console.log("style-codes");
});

router.post("colors", (req: Request, res: Response, next: NextFunction) => {
  console.log("colors");
  debugger;
});

router.get("colors", (req: Request, res: Response, next: NextFunction) => {
  console.log("get colors");
  debugger;
  const colors = `${__dirname}/colors.json`;
  if (!fs.existsSync(colors)) fs.writeFileSync(colors, JSON.stringify({}));

  let text = fs.readFileSync(colors).toString("utf8");
  res.send(JSON.parse(text));
});

router.get("/:name", (req: Request, res: Response, next: NextFunction) => {
  // Extract the name from the request parameters
  let { name } = req.params;
  console.info("request" + req.originalUrl);
  // Greet the given name
  next();
  res.send(`Hello, ${name}`);
});

router.post(
  "/VerifyEmpID",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("api");
    fetch("http://norweb/reporting/paint.asmx/VerifyEmpID", {
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      method: "POST",
      mode: "cors"
    })
      .then(o => {
        console.log("success");
      })
      .catch(o => {
        console.log("fail " + o);
        res.send(o);
      });

    res.send("respond with a resource");
  }
);

// Export the express.Router() instance to be used by server.ts
export const APIController: Router = router;
