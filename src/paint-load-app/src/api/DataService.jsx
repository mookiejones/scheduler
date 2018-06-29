import PaintScheduleData from "./PaintScheduleData";
import PaintScheduleStylesData from "./PaintScheduleStylesData";
import StyleCodeProgramData from "./StyleCodeProgramData";
import PaintScheduleProgramsData from "./PaintScheduleProgramsData";
import PaintLoadAssistData from "./PaintLoadAssistData";
import PaintStageData from "./PaintStageData";
import PaintLoadData from "./PaintLoadData";
import { DELETE_KEY, API_SERVER } from "../Constants";
import fetch from "node-fetch";
const asPromise = (value) => new Promise((resolve) => resolve(value));

const sendData = (value) => asPromise(value);

const isArray = (item) => {
  return Object.prototype.toString.call(item) === "[object Array]";
};
const sortFn = (a, b) => {
  const roundA = parseInt(a[2], 10);
  const posA = parseInt(a[3], 10);
  const roundB = parseInt(b[2], 10);
  const posB = parseInt(b[3], 10);
  const qtyA = parseInt(a[9], 10);
  const qtyB = parseInt(b[9], 10);

  if (roundA === roundB) {
    // if round is the same, sort by round_position
    if (posA === posB) {
      if (qtyA < qtyB) {
        return -1;
      } else if (qtyA > qtyB) {
        return 1;
      }
      return 0;
    }
    return posA < posB ? -1 : 1;
  }
  return roundA < roundB ? -1 : 1;
};

let testFlag = true;
class DataService {
  constructor(bind) {
    this.bind = bind;
  }

  static get isTest() {
    return testFlag;
  }

  static LoginUser(userId) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      let url = `${API_SERVER}/reporting/paint.asmx/VerifyEmpID?EmployeeID=${userId}`;
      request.open("POST", url, true);
      request.setRequestHeader(
        "Content-Type",
        "application/json; charset=UTF-8"
      );
      request.onload = () => {
        resolve(JSON.parse(request.response));
      };
      request.onabort = (e) => {
        debugger;
      };

      request.onerror = (e) => {
        debugger;
        console.error(e);
      };
      request.send(JSON.stringify({ EmployeeID: userId }));
    });
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
        console.info(
          `Found index at ${index}, item is ${schedules.RoundData[index]}`
        );

        break;
    }
  }

  static GetPaintStageList() {
    return sendData(PaintStageData.fetch(DataService.isTest));
  }
  static GetPaintLoadAssist() {
    return sendData(PaintLoadAssistData.fetch(DataService.isTest));
  }

  static GetPaintLoad() {
    return sendData(PaintLoadData.fetch(DataService.isTest));
  }
  static GetPaintScheduleStyles() {
    const result = sendData(PaintScheduleStylesData.fetch(DataService.isTest));
    return result;
  }
  static GetPaintInfo(type) {
    const url = `${API_SERVER}/reporting/paint.asmx/${type}? HTTP/1.1`;
    return fetch(url)
      .then((r) => r.json())
      .then((r) => {
        let result = r.sort(sortFn);
        return isArray(result) && isArray(result[1]) && result[0].length > 2
          ? {
              data: result.map((item) => {
                return {
                  id: item[0],
                  master_id: item[1],
                  round: item[2],
                  round_pos: item[3],
                  description: item[4],
                  notes: item[5],
                  color: item[6],
                  mold_skin_style: item[7],
                  rework_color_chart: item[8],
                  quantity: item[9],
                  ten: item[10],
                  staged_by: item[11],
                  handled_by: item[12],
                  picked_by: item[13],
                  extra1: item[14],
                  extra2: item[15]
                };
              }),
              currentRoundNumber: result[0][2]
            }
          : {};
      })
      .catch((e) => {
        debugger;
      });
  }
  static GetPaintPickList() {}
  static GetPaintSchedulePrograms() {
    const result = sendData(
      PaintScheduleProgramsData.fetch(DataService.isTest)
    );
    return result;
  }
  static GetPaintScheduleSync() {
    return PaintScheduleData.fetch(DataService.isTest);
  }
  static getPaintSchedule(arg) {
    const result = sendData(PaintScheduleData.fetch(DataService.isTest));
    if (arg) {
      return result.bind(arg);
    }
    return result;
  }

  static GetStyleCodes(arg) {
    const result = sendData(PaintScheduleStylesData.fetch(DataService.isTest));
    if (arg) {
      return result.bind(arg);
    }
    return result;
  }

  static GetPrograms() {
    const result = sendData(StyleCodeProgramData.fetch(DataService.isTest));
    return result;
  }
}

export default DataService;
