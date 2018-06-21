import PaintScheduleData from "./PaintScheduleData";
import PaintScheduleStylesData from "./PaintScheduleStylesData";
import PaintScheduleColorsData from "./PaintScheduleColorsData";
import StyleCodeProgramData from "./StyleCodeProgramData";
import PaintScheduleProgramsData from "./PaintScheduleProgramsData";
import PaintLoadAssistData from "./PaintLoadAssistData";
import PaintLoadData from "./PaintLoadData";
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
        const index = schedules.RoundData.findIndex((v, i, n) => v.id === value.id);
        const result = schedules.RoundData.splice(index, 1);
        return result;
        console.info(`Found index at ${index}, item is ${schedules.RoundData[index]}`);

        break;
    }
    const data = { ss: [value] };
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

  static GetPaintSchedulePrograms() {
    const result = sendData(PaintScheduleProgramsData.fetch(DataService.isTest));
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

  static GetColorCodes(arg) {
    const result = sendData(PaintScheduleColorsData.fetch(DataService.isTest));

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
