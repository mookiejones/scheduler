import PaintScheduleData from "./PaintScheduleData";
import PaintScheduleStylesData from "./PaintScheduleStylesData";
import PaintScheduleColorsData from "./PaintScheduleColorsData";

import { DELETE_KEY } from "../Constants";

const asPromise = value => new Promise(resolve => resolve(value));

const sendData = value => asPromise(value);

let testFlag = true;
class DataService {
  constructor(bind) {
    this.bind = bind;
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
          (v, i, n) => v.id === value.id,
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
}

export default DataService;
