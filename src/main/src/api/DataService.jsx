import PaintScheduleData from "./PaintScheduleData";
import PaintScheduleStylesData from "./PaintScheduleStylesData";
import PaintScheduleColorsData from "./PaintScheduleColorsData";
import DriverAverages from "./DriverAverages";
import { DELETE_KEY } from "../Constants";

const asPromise = (value) => new Promise((resolve) => resolve(value));

const sendData = (value) => asPromise(value);

let testFlag = true;
class DataService {
  constructor(bind) {
    this.bind = bind;
  }
  static AddRound(date) {
    debugger;
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

  static GetColorCodes(arg) {
    const result = sendData(PaintScheduleColorsData.fetch(DataService.isTest));

    if (arg) {
      return result.bind(arg);
    }
    return result;
  }

  static GetDriverAverages(params) {
    return DriverAverages.fetch(DataService.isTest, params);
  }
}

export default DataService;