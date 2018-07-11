// const io = require( 'socket.io-client' );
var app = require("express")();
const http = require("http");

const empty = JSON.stringify({});
const {
  XMLHttpRequest
} = require("xmlhttprequest");

const getInfo = (req, res, next) => {
  try {
    var request = new XMLHttpRequest();
    let url = `http://norweb/${req.url}`;

    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.onload = () => {
      let data = {
        success: (request.status >= 200 && request.status < 400)
      };

      try {
        if (data.success) {
          let output = JSON.parse(request.responseText);
          if (output.d) {
            let raw = JSON.parse(output.d);
            data["result"] = raw;
            if (typeof data.result === "string")
              res.send(JSON.parse(data))

            else {
              res.send(data);
            }
          } else {
            debugger;
          }
        }
      } catch (e) {
        debugger;
      }
    };
    request.send(empty);
  } catch (e) {
    debugger;
  }
};
const server = http.Server(app);
var io = require("socket.io")(server);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/test", (req, res) => {
  res.send({
    result: "ok"
  });
});

const links = [
  "getPntRevise",
  "GetPaintLoadList",
  "GetPaintPickList",
  "GetPaintStageList",
  "GetPaintSchedule",
  "GetPaintScheduleStyles",
  "ScheduleNewRound",
  "GetProgramColors",
  "AddColorRule",
  "GetColorRules"
];

links.forEach((link) => {
  app.get(`/reporting/paint.asmx/${link}`, getInfo);
  app.get(`/reporting/paint.asmx/${link}Test`, getInfo);
});

// app.post(`/reporting/paint.asmx/DeleteColorRule/id/${itemId}`, (req, ress, next) => {
//   ress.send({
//     "ok": 1,
//     "message": "works"
//   });
// })
app.post(
  "/reporting/paint.asmx/GetDriverAverages/startdate/:startdate/enddate/:enddate",
  (req, res, next) => {
    try {
      var request = new XMLHttpRequest();
      let url = `http://norweb/reporting/paint.asmx/GetDriverAverages`;

      request.open("POST", url, true);
      request.setRequestHeader(
        "Content-Type",
        "application/json; charset=UTF-8"
      );
      request.onload = () => {
        try {
          if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            if (data.d) {
              if (/[\[\{:]+/i.test(data.d)) res.send(JSON.parse(data.d));
              else {
                res.send(data);
              }
            } else {
              debugger;
            }
          }
        } catch (e) {
          debugger;
        }
      };
      request.send(JSON.stringify(req.params));
    } catch (e) {
      debugger;
    }
  }
);
app.post("/reporting/paint.asmx/VerifyEmpID?:EmployeeID", (req, ress, next) => {
  http
    .get(`http://norweb/${req.url}`, (res) => {
      const {
        statusCode
      } = res;
      const contentType = res.headers["content-type"];
      let error;
      if (statusCode !== 200) {
        error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
      } else {
        switch (contentType) {
          case "text/xml; charset=utf-8":
            break;
          default:
            console.log(contentType);
            break;
        }
      }

      // if ( !/^application\/json/.test( contentType ) ) {
      //     error = new Error( 'Invalid content-type.\n' +
      //         `Expected application/json but received ${contentType}` );
      // }
      if (error) {
        console.error(error.message);
        res.send(error);

        return;
      }

      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          let output = rawData.replace(/<[^>]*>/gi, "").trim();

          ress.send({
            d: output
          });
        } catch (e) {
          console.error(e.message);
        }
      });
    })
    .on("error", (e) => {
      console.error(`Got error: ${e.message}`);
    });
});

app.post("/api/VerifyEmpID/:User", (a, b) => {
  debugger;
});

// let socket = io( 'http://normagnaapps1:5555/paint-load' );

io.of("/paint-load").on("connection", function (socket) {
  socket.on("event", function (data) {
    socket.broadcast.emit("update", data);
  });
  socket.on("rowupdate", function (data) {
    socket.broadcast.emit("rowupdate", data);
  });
  socket.on("rowdelete", function (data) {
    socket.broadcast.emit("rowdelete", data);
  });
  socket.on("newrow", function (data) {
    socket.broadcast.emit("newrow", data);
  });
});
server.listen(5555);