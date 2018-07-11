<<<<<<< HEAD
import PaintScheduleData from './PaintScheduleData';
import { ColorRule } from '../components/ScheduleEditor/Rules';
import DataItemBase from './DataItemBase';
import PaintScheduleStylesData from './PaintScheduleStylesData';
import PaintScheduleColorsData from './PaintScheduleColorsData';
import DriverAverages from './DriverAverages';
import { stringify } from 'querystring';
import { PRODUCTION, API_SERVER, DELETE_KEY } from '../Constants';
import fetch from 'node-fetch';
const asPromise = value => new Promise(resolve => resolve(value));

const sendData = value => asPromise(value);

let testFlag = true;
class DataService {
  constructor(bind) {
    this.bind = bind;
  }

  static initialize() {
    DataService.GetColorRules().then(rules => {
      if (rules.length < 2) {
        [
          new ColorRule('color', 'service', 'service', '#ECEFF1', 1),
          new ColorRule('notes', 'dontship', 'do not ship', '#FF1744', 1),
          new ColorRule('notes', 'shipifgood', 'ship if good', '#81C784', 1),
          new ColorRule('notes', 'build', 'build', '#FFF176', 1),
          new ColorRule('id', 'bgSuccess', 'TEMP', '#dff0d8', 0),
          new ColorRule('id', 'bgNormal', 'TEMP', '#FFFFFF', 0),
          new ColorRule('notes', 'redhot', 'red hot', '#FF1744', 0)
        ].forEach(rule => {
          DataService.AddColorRule(rule);
        });
      }
    });
  }
  static LoginUser(id) {
    if (!PRODUCTION) return new Promise((resolve, reject) => resolve('cberman'));
  }

  static AddColorRule(rule) {
    const url = `${API_SERVER}/reporting/paint.asmx/AddColorRule`;
    const body = stringify(rule);
    const options = {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    return fetch(url, options)
      .then(o => {
        debugger;
        return o.json();
      })
      .then(o => {
        debugger;
      })
      .catch(error => {
        debugger;
      });

    // SqlHelper.AddColorRule(rule);
  }
  static DeleteColorRule(rule) {
    const url = `${API_SERVER}/reporting/paint.asmx/DeleteColorRule`;
    const body = stringify(rule);
    const options = {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    return fetch(url, options)
      .then(DataService.GetColorRules)

      .catch(error => {
        debugger;
      });

    // SqlHelper.AddColorRule(rule);
  }

  static SaveColorRule(item) {
    debugger;
    return DataItemBase.getDataPromise(`SaveColorRule/id/${item}`).then(DataService.GetColorRules);
  }
  static GetColorRules() {
    return DataItemBase.getDataPromise('GetColorRules').then(items =>
      items.result.map(
        item => new ColorRule(item[0], item[1], item[2], item[5], item[3], item[4] == 1)
      )
    );
  }
  static AddRound(date = null) {
    debugger;
    let query = { selectedDate: null };
    const url = `${API_SERVER}/reporting/paint.asmx/ScheduleNewRound`;
    // let query = JSON.parse({ selectedDate: date });

    // const url = `${API_SERVER}/reporting/paint.asmx/GetDriverAverages/startdate/${
    //   query.startdate
    // }/enddate/${query.enddate}`;
    // return fetch(url, {
    //   method: "POST",
    //   body: query
    // }).then((result) => {
    //   debugger;
    //   return result.json();
    // });
    // debugger;
    /*
    $.ajax({
      method: "POST",
      url,
      data: JSON.stringify({
        selectedDate: this.state.selectedDate
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success(msg) {
        const data = JSON.parse(msg.d);
        const roundData = data[0] || [];
        const roundSummary = {};
        if (data[1]) {
          for (let i = 0; i < data[1].length; i++) {
            roundSummary[data[1][i].round] = data[1][i];
          }
        }

        this.setState({
          rows: roundData.slice(),
          initialRows: roundData.slice(),
          roundSummary,
          selectedRound: data[1][data[1].length - 1].round
        });
      },
      error(request, status, error) {
        console.log(error);
      }
    });*/
    return new Promise((resolve, reject) => {});
  }

  static ScheduleNewRound() {
    return DataItemBase.getDataPromise('ScheduleNewRound');
  }
  static LoadRound() {}
  static DeleteFromExcel(data) {}
  static DeleteRound(data) {}
  static ToExcelDB(data) {}
  static UpdateRow(row) {
    debugger;
    return new Promise((resolve, reject) => {});
    /*
    $.ajax({
      method: "POST",
      url,
      data: JSON.stringify({ ss: [row] }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success(msg) {
        const data = JSON.parse(msg.d);
        const updateq2 = Object.assign({}, this.state.queuedUpdates);
        updateq2[hash] = 0;
        delete updateq2[hash];
        this.setState({ queuedUpdates: updateq2, insertingRow: false });
        this.getPaintSchedule();
      },
      error(request, status, error) {
        console.log(error);
      },
    });*/
  }
  static get isTest() {
    return testFlag;
  }

  static set isTest(value) {
    testFlag = value;
  }

  static UpdatePaintSchedule(value) {
    switch (value.action) {
      case DELETE_KEY:
        const schedules = DataService.GetPaintScheduleSync();
        const index = schedules.RoundData.findIndex((v, i, n) => v.id === value.id);
        const result = schedules.RoundData.splice(index, 1);
        return result;

      default:
        console.warning(`Need to add case for ${value.action}`);
        break;
    }
  }

  static getPaintSchedule = rules => sendData(PaintScheduleData.fetch(rules));

  static GetStyleCodes = arg => DataItemBase.getDataPromise('GetPaintScheduleStyles');

  static GetColorCodes = arg => DataItemBase.getDataPromise('GetProgramColors');

  static GetDriverAverages(params) {
    return DriverAverages.fetch(DataService.isTest, params);
  }
}

if (!PRODUCTION) DataService.initialize();
export default DataService;
=======
import PaintScheduleData from './PaintScheduleData';
import { ColorRule } from '../components/ScheduleEditor/Rules';
import DataItemBase from './DataItemBase';

import DriverAverages from './DriverAverages';
import { PRODUCTION, API_SERVER, DELETE_KEY } from '../Constants';

import DriverPerformanceData from './DriverPerformance';
const asPromise = value => new Promise(resolve => resolve(value));

const sendData = value => asPromise(value);

let testFlag = true;
class DataService {
  constructor(bind) {
    this.bind = bind;
  }
  static LoginUser(id) {
    if (!PRODUCTION) {
      return new Promise((resolve, reject) => resolve('cberman'));
    }
  }

  static AddColorRule(rule) {
    debugger;
    // SqlHelper.AddColorRule(rule);
  }
  static DeleteColorRule(item) {
    return DataItemBase.getDataPromise(`DeleteColorRule/id/${item.Id}`).then(
      items => {
        debugger;
        return items.result.map(
          item =>
            new ColorRule(
              item[0],
              item[1],
              item[2],
              item[5],
              item[3],
              item[4] == 1
            )
        );
      }
    );
  }

  static SaveColorRule(item) {
    debugger;
    return DataItemBase.getDataPromise(`SaveColorRule/id/${item}`).then(
      DataService.GetColorRules
    );
  }
  static GetColorRules() {
    return DataItemBase.getDataPromise('GetColorRules').then(items =>
      items.result.map(
        item =>
          new ColorRule(
            item[0],
            item[1],
            item[2],
            item[5],
            item[3],
            item[4] == 1
          )
      )
    );
  }
  static AddRound(date = null) {
    debugger;
    let query = { selectedDate: null };
    const url = `${API_SERVER}/reporting/paint.asmx/ScheduleNewRound`;
    // let query = JSON.parse({ selectedDate: date });

    // const url = `${API_SERVER}/reporting/paint.asmx/GetDriverAverages/startdate/${
    //   query.startdate
    // }/enddate/${query.enddate}`;
    // return fetch(url, {
    //   method: "POST",
    //   body: query
    // }).then((result) => {
    //   debugger;
    //   return result.json();
    // });
    // debugger;
    /*
    $.ajax({
      method: "POST",
      url,
      data: JSON.stringify({
        selectedDate: this.state.selectedDate
      }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success(msg) {
        const data = JSON.parse(msg.d);
        const roundData = data[0] || [];
        const roundSummary = {};
        if (data[1]) {
          for (let i = 0; i < data[1].length; i++) {
            roundSummary[data[1][i].round] = data[1][i];
          }
        }

        this.setState({
          rows: roundData.slice(),
          initialRows: roundData.slice(),
          roundSummary,
          selectedRound: data[1][data[1].length - 1].round
        });
      },
      error(request, status, error) {
        console.log(error);
      }
    });*/
    return new Promise((resolve, reject) => {});
  }

  static ScheduleNewRound() {
    return DataItemBase.getDataPromise('ScheduleNewRound');
  }
  static LoadRound() {}
  static DeleteFromExcel(data) {}
  static DeleteRound(data) {}
  static ToExcelDB(data) {}
  static UpdateRow(row) {
    debugger;
    return new Promise((resolve, reject) => {});
    /*
    $.ajax({
      method: "POST",
      url,
      data: JSON.stringify({ ss: [row] }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success(msg) {
        const data = JSON.parse(msg.d);
        const updateq2 = Object.assign({}, this.state.queuedUpdates);
        updateq2[hash] = 0;
        delete updateq2[hash];
        this.setState({ queuedUpdates: updateq2, insertingRow: false });
        this.getPaintSchedule();
      },
      error(request, status, error) {
        console.log(error);
      },
    });*/
  }
  static get isTest() {
    return testFlag;
  }

  static set isTest(value) {
    testFlag = value;
  }

  static UpdatePaintSchedule(value) {
    switch (value.action) {
      case DELETE_KEY:
        const schedules = DataService.GetPaintScheduleSync();
        const index = schedules.RoundData.findIndex(
          (v, i, n) => v.id === value.id
        );
        const result = schedules.RoundData.splice(index, 1);
        return result;

      default:
        console.warning(`Need to add case for ${value.action}`);
        break;
    }
  }

  static getPaintSchedule(rules) {
    return sendData(PaintScheduleData.fetch(rules));
  }

  static GetStyleCodes(arg) {
    return DataItemBase.getDataPromise('GetPaintScheduleStyles');
  }

  static GetColorCodes(arg) {
    return DataItemBase.getDataPromise('GetProgramColors');
  }

  static GetDriverAverages(params) {
    return new Promise(resolve => resolve(DriverPerformanceData));
    return DriverAverages.fetch(DataService.isTest, params);
  }
}

export default DataService;
>>>>>>> 54bff62b49d00a35bc3fb70d304925057c5a50c8
