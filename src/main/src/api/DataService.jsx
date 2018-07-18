import { stringify } from 'querystring';
import fetch from 'node-fetch';
import PaintScheduleData from './PaintScheduleData';
import { ColorRule } from '../components/ScheduleEditor/Rules';
import DataItemBase from './DataItemBase';
import DriverAverages from './DriverAverages';
import {
 PRODUCTION, API_SERVER, DELETE_KEY, Constants
} from '../Constants';
import PaintStageData from './PaintStageData';

const asPromise = value => new Promise(resolve => resolve(value));

const sendData = value => asPromise(value);

let testFlag = true;
class DataService {
  constructor(bind) {
    this.bind = bind;
  }

  static initialize() {
    DataService.GetColorRules().then((rules) => {
      if (rules.length < 2) {
        [
          new ColorRule('color', 'service', 'service', '#ECEFF1', 1),
          new ColorRule('notes', 'dontship', 'do not ship', '#FF1744', 1),
          new ColorRule('notes', 'shipifgood', 'ship if good', '#81C784', 1),
          new ColorRule('notes', 'build', 'build', '#FFF176', 1),
          new ColorRule('id', 'bgSuccess', 'TEMP', '#dff0d8', 0),
          new ColorRule('id', 'bgNormal', 'TEMP', '#FFFFFF', 0),
          new ColorRule('notes', 'redhot', 'red hot', '#FF1744', 0)
        ].forEach((rule) => {
          DataService.AddColorRule(rule);
        });
      }
    });
  }

  static LoginUser(emp) {
    const url = Constants.VerifyEmployee;
    const body = stringify({ EmployeeID: emp.id });
    return DataItemBase.postData(url, body);
  }

  // if (!PRODUCTION) return new Promise((resolve, reject) => resolve('cberman'));
  // throw new Error('Need to fix Login User');

  static AddColorRule(rule) {
    const url = `${API_SERVER}/reporting/paint.asmx/AddColorRule`;
    const body = stringify(rule);
    const options = {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    return fetch(url, options)
      .then((o) => {
        debugger;
        return o.json();
      })
      .catch((error) => {
        debugger;
      });

    // SqlHelper.AddColorRule(rule);
  }

  static DeleteColorRule(rule) {
    const url = `${API_SERVER}/reporting/paint.asmx/DeleteColorRule`;
    const body = stringify(rule);

    return DataItemBase.postData(url, body)
      .then(DataService.GetColorRules)
      .catch((error) => {
        debugger;
      });

    // SqlHelper.AddColorRule(rule);
  }

  static CheckOutRow(data) {
    const url = `${API_SERVER}/reporting/paint.asmx/CheckOutRow`;

    const body = stringify(data);

    return DataItemBase.postData('CheckOutRow', body)
      .then((o) => {
        if (!o.ok) {
          debugger;
        }
        return o.json();
      })

      .catch((error) => {
        debugger;
      });
  }

  static SaveColorRule(item) {
    debugger;
    return DataItemBase.getDataPromise(`SaveColorRule/id/${item}`).then(DataService.GetColorRules);
  }

  static GetColorRules() {
    return DataItemBase.getDataPromise('GetColorRules').then(items => items.result.map(
        item => new ColorRule(item[0], item[1], item[2], item[5], item[3], item[4] === 1)
      ));
  }

  static AddRound(date = null) {
    debugger;
    // const query = { selectedDate: null };
    // const url = `${API_SERVER}/reporting/paint.asmx/ScheduleNewRound`;
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
    }); */
    return new Promise((resolve, reject) => {});
  }

  static ScheduleNewRound() {
    const p = DataItemBase.getDataPromise(Constants.ScheduleNewRound);

    return p.then(o => new PaintScheduleData(o, []));
  }

  static GetPaintInfo(data) {
    return DataItemBase.getDataPromise(data).then(o => new PaintStageData(o.result));
  }

  static GetPaintLoadInfo(name) {
    return DataItemBase.getDataPromise(name)
      .then(o => new PaintStageData(o.result))
      .then(o => o);
  }

  static GetPaintLoad() {
    debugger;
    alert('GetPaintLoad');
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
    }); */
  }

  static get isTest() {
    return testFlag;
  }

  static set isTest(value) {
    testFlag = value;
  }

  static UpdatePaintSchedule(value) {
    if (value.action === DELETE_KEY) {
      const schedules = DataService.GetPaintScheduleSync();
      const index = schedules.RoundData.findIndex((v, i, n) => v.id === value.id);
      const result = schedules.RoundData.splice(index, 1);
      return result;
    }
    debugger;
    throw new Error(`Need to add in action for ${value.action}`);
  }

  static getPaintSchedule(rules) {
    return sendData(PaintScheduleData.fetch(rules));
  }

  static GetStyleCodes() {
    return DataItemBase.getDataPromise(Constants.PaintScheduleStyles);
  }

  static GetColorCodes() {
    return DataItemBase.getDataPromise(Constants.GetProgramColors);
  }

  static GetDriverAverages(params) {
    return DriverAverages.fetch(DataService.isTest, params);
  }
}

if (!PRODUCTION) DataService.initialize();
export default DataService;
