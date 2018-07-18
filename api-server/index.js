// const io = require( 'socket.io-client' );
var app = require('express')();

const http = require('http');

const sql = require('mssql');
const bodyParser = require('body-parser');
const {
  ConnectionPool,
  Request
} = require('mssql');

const sqlOptions = {
  server: 'norplassql',
  user: 'sa_pass',
  password: 'apassword',
  database: 'SmallProjects'
};
const chalk = require('chalk');
const {
  log
} = console;

app.use(bodyParser.json()); // support json encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
); // support encoded bodies

const BASE_URL = '/reporting/paint.asmx/';
const write = (msg, color) => log(chalk[color](msg));
const red = (msg) => write(msg, 'red');

const yellow = (msg) => write(msg, 'yellow');

const green = (msg) => write(msg, 'green');

const getUrl = (p) => `${BASE_URL}${p}`;
green('starting server');
const empty = JSON.stringify({});
const {
  XMLHttpRequest
} = require('xmlhttprequest');

const getInfo = (req, res, next) => {
  green(`getInfo ${req.url}`);
  try {
    var request = new XMLHttpRequest();
    let url = `http://norweb/${req.url}`;

    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {
      let data = {
        success: request.status >= 200 && request.status < 400
      };

      try {
        if (data.success) {
          let output = JSON.parse(request.responseText);
          if (output.d) {
            let raw = JSON.parse(output.d);
            data['result'] = raw;
            yellow('Sending data');
            if (typeof data.result === 'string') res.send(JSON.parse(data));
            else {
              res.send(data);
            }
          } else {
            debugger;
            red('theres an error');
          }
        }
      } catch (e) {
        debugger;
        red(e);
      }
    };
    request.send(empty);
  } catch (e) {
    debugger;
    red(`we didnt even get that far ${e}`);
  }
};
const server = http.Server(app);
var io = require('socket.io')(server);
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.get('/test', (req, res) => {
  res.send({
    result: 'ok'
  });
});

const links = [{
    type: 'get',
    link: 'getPntRevise'
  },
  {
    type: 'get',
    link: 'GetPaintLoadList'
  },
  {
    type: 'get',
    link: 'GetPaintPickList'
  },
  {
    type: 'get',
    link: 'GetPaintStageList'
  },
  {
    type: 'get',
    link: 'GetPaintSchedule'
  },
  {
    type: 'get',
    link: 'GetPaintScheduleStyles'
  },
  {
    type: 'get',
    link: 'ScheduleNewRound'
  },
  {
    type: 'get',
    link: 'GetProgramColors'
  },
  {
    type: 'get',
    link: 'AddColorRule'
  },
  {
    type: 'post',
    link: 'CheckOutRow'
  },
  {
    type: 'get',
    link: 'GetColorRules'
  }
];
links
  .filter(link => link.type === "get")
  .forEach(link => {
    app.get(`/reporting/paint.asmx/${link.link}`, getInfo);
    app.get(`/reporting/paint.asmx/${link.link}Test`, getInfo);
  })

const postInfo = (req, res, next) => {
  const request = new XMLHttpRequest();
  let url = `http://norweb${req.url}`;
  request.open('POST', url, true);
  request.setRequestHeader(
    'Content-Type',
    'application/json; charset=UTF-8'
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

  }
  request.send(JSON.stringify(req.body));
}
links
  .filter(link => link.type === "post")
  .forEach(link => {
    app.post(`/reporting/paint.asmx/${link.link}`, postInfo);
    app.post(`/reporting/paint.asmx/${link.link}Test`, postInfo);
  })

// app.post(`/reporting/paint.asmx/DeleteColorRule/id/${itemId}`, (req, ress, next) => {
//   ress.send({
//     "ok": 1,
//     "message": "works"
//   });
// })
app.post(
  '/reporting/paint.asmx/GetDriverAverages/startdate/:startdate/enddate/:enddate',
  (req, res, next) => {
    try {
      var request = new XMLHttpRequest();
      let url = `http://norweb/reporting/paint.asmx/GetDriverAverages`;

      request.open('POST', url, true);
      request.setRequestHeader(
        'Content-Type',
        'application/json; charset=UTF-8'
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
app.post('/reporting/paint.asmx/GetEmployee?:EmployeeID', (req, ress, next) => {
  try {
    var request = new XMLHttpRequest();

    let url = `http://norweb${req.url}`; ///VerifyEmpID?EmployeeID=` + req.body.EmployeeID;

    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {


      let data = {
        success: request.status >= 200 && request.status < 400
      };


      try {
        if (data.success) {
          let output = JSON.parse(request.responseText);
          if (output.d) {
            ress.send(JSON.stringify(output));
            // let raw = JSON.parse(output.d);
            // data['result'] = raw;
            // yellow('Sending data');
            // if (typeof data.result === 'string') res.send(JSON.parse(data));
            // else {
            //   res.send(data);
            // }
          } else {
            debugger;
            red('theres an error');
          }
        }
      } catch (e) {
        debugger;
        red(e);
      }
    };
    request.send(JSON.stringify(req.body));
  } catch (e) {
    debugger;
  }
});

app
  .post('/reporting/paint.asmx/GetColorRulesTest', (request, result, next) => {
    debugger;
  })
  .get(getUrl('DeleteColorRule/id'), (req, res, next) => {
    debugger;
  })
  .get(getUrl('DeleteColorRule/id/:number'), (req, res, next) => {
    debugger;
  })
  .get(getUrl('DeleteColorRule/id/:number? HTTP/1.1'), (req, res, next) => {
    debugger;
  })
  .get(getUrl('DeleteColorRuleTest/id'), (req, res, next) => {
    debugger;
  })
  .get(getUrl('DeleteColorRuleTest/id/:number'), (req, res, next) => {
    const {
      number
    } = req.params;

    const pool = new ConnectionPool(sqlOptions)
      .connect()
      .then((o) => {
        const request = new Request(o);
        return request
          .query(
            `DELETE from schedule_editor_color_rules where id=${parseInt(
              number,
              10
            )};`
          )
          .then((r) => {
            debugger;
            let request2 = new Request(o);
            return request2
              .query(`SELECT * from schedule_editor_color_rules`)
              .then((columns) => {
                res.send(columns.recordset);

                debugger;
              })
              .catch((error) => {
                debugger;
              });
          });
        debugger;
      })
      .catch((o) => {
        debugger;
      });
    return pool;
  })
  .post(getUrl('DeleteColorRule'), (req, res, next) => {
    const {
      body
    } = req;

    const pool = new ConnectionPool(sqlOptions)
      .connect()
      .then((o) => {
        const request = new Request(o);
        return request
          .query(
            `DELETE from schedule_editor_color_rules where id=${parseInt(
              body.id,
              10
            )};`
          )
          .then((r) => {
            let request2 = new Request(o);
            return request2
              .query(`SELECT * from schedule_editor_color_rules`)
              .then((columns) => {
                res.send(columns.recordset);
              })
              .catch((error) => {
                debugger;
              });
          });
        debugger;
      })
      .catch((o) => {
        debugger;
      });
    return pool;
  })
  .post(getUrl('AddColorRule'), (req, res, next) => {
    const {
      body
    } = req;

    const keys = Object.keys(body).filter((o) => !/id/i.test(o));
    const item = {};
    keys.forEach((key) => {
      item[key] = body[key];
    });

    const values = Object.values(item)
      .map((o) => `'${o}'`)
      .join(',');
    return new ConnectionPool(sqlOptions).connect().then((o) => {
      return new Request(o)
        .query(
          `INSERT into schedule_editor_color_rules (${keys
            .map((o) => `[${o}]`)
            .join(`,`)}) VALUES (${values})`
        )
        .then((r) => {
          res.send({
            ok: 1
          });
        })
        .catch((error) => {
          debugger;
        });
    });
    debugger;
  })
  .get(getUrl('DeleteColorRuleTest/id/:number? HTTP/1.1'), (req, res, next) => {
    debugger;
  })
  .get(getUrl('AddColorRule/:item? HTTP/1.1'), (req, res, next) => {
    debugger;
  })
  .get(getUrl('AddColorRuleTest/:item'), (req, res, next) => {
    try {
      const obj = JSON.parse(req.params.item);
      console.log(obj);
    } catch (e) {
      console.error(e);
    }
  });

// let socket = io( 'http://normagnaapps1:5555/paint-load' );

io.of('/paint-load').on('connection', function (socket) {
  socket.on('event', function (data) {
    green('socket.event');
    socket.broadcast.emit('update', data);
  });
  socket.on('rowupdate', function (data) {
    green('socket.rowupdate');

    socket.broadcast.emit('rowupdate', data);
  });
  socket.on('rowdelete', function (data) {
    green('socket.rowdelete');
    socket.broadcast.emit('rowdelete', data);
  });
  socket.on('newrow', function (data) {
    green('socket.newrow');
    socket.broadcast.emit('newrow', data);
  });
});
server.listen(5555);