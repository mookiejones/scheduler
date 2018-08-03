 
const p = require('../../package.json');

export const VERSION = p.version;
export const DELETE = 'DELETE';
export const UPDATE = 'UPDATE';
export const AVAILABLE = '##AVAILABLE##';
export const ASSIST = 'assist';

export const PRODUCTION = 'production';
export const STAGE = 'stage';
export const WATCH = 'watch';
export const LOAD = 'load';
export const UNDO_KEY = 'undo';
export const ROUND_KEY = 'round';
export const GET_DRIVER_AVERAGES = 'GetDriverAverages';
export const INSERT = 'INSERT';
export const CHECK_OUT_ROW = 'CheckOutRow';
export const CHECK_IN_ROW = 'CheckInRow';
export const RELEASE_ROW = 'ReleaseRow';
export const STAGE_ROW = 'StageRow';
export const GET_PAINT_REVISE = 'GetPaintRevise';
export const GET_PAINT_PICK_LIST = 'GetPaintPickList';
export const GET_PAINT_STAGE_LIST = 'GetPaintStageList';
export const GET_PAINT_LOAD_LIST = 'GetPaintLoadList';
export const GET_ROUNDS = 'getRounds';
export const VERIFY_EMP_ID = 'VerifyEmpID';
export const DELETE_WHOLE_ROUND = 'delWholeRound';
export const GET_PROGRAM_COLORS = 'GetProgramColors';
export const GET_PAINT_SCHEDULE_PROGRAMS = 'GetPaintSchedulePrograms';
export const GET_PAINT_SCHEDULE_COLORS_FOR_SCHEDULER =
  'GetPaintScheduleColorsForScheduler';
export const PNT_SCHL_IMPORT_2 = 'pntSchlImport2';
export const SAVE_PNT_REVISE = 'savePntRevise';
export const PERSIST_STYLE_CODE_ROW = 'PersistStyleCodeRow';
const SCHEDULE_NEW_ROUND = 'ScheduleNewRound';
export class Actions {
  static get Insert() {
    return INSERT;
  }
  static get Delete() {
    return DELETE;
  }

  static get Update() {
    return UPDATE;
  }
}
export class URLS {
  static get GetDriverAverages() {
    return GET_DRIVER_AVERAGES;
  }
  static get StageRow() {
    return STAGE_ROW;
  }
  static get ReleaseRow() {
    return RELEASE_ROW;
  }
  static get CheckInRow() {
    return CHECK_IN_ROW;
  }
  static get CheckOutRow() {
    return CHECK_OUT_ROW;
  }
  static get GetPaintRevise() {
    return GET_PAINT_REVISE;
  }
  static get GetPaintPickList() {
    return GET_PAINT_PICK_LIST;
  }
  static get GetPaintStageList() {
    return GET_PAINT_STAGE_LIST;
  }
  static get GetPaintLoadList() {
    return GET_PAINT_LOAD_LIST;
  }
  static get GetRounds() {
    return GET_ROUNDS;
  }
  static get DeleteWholeRound() {
    return DELETE_WHOLE_ROUND;
  }
  static get SavePaintRevise() {
    return SAVE_PNT_REVISE;
  }
  static get PaintScheduleImport2() {
    return PNT_SCHL_IMPORT_2;
  }
  static get GetProgramColors() {
    return GET_PROGRAM_COLORS;
  }
  static get GetPaintSchedulePrograms() {
    return GET_PAINT_SCHEDULE_PROGRAMS;
  }
  static get GetPaintScheduleColorsForScheduler() {
    return GET_PAINT_SCHEDULE_COLORS_FOR_SCHEDULER;
  }
  static get VerifyEmpID() {
    return VERIFY_EMP_ID;
  }
  static get ScheduleNewRound() {
    return SCHEDULE_NEW_ROUND;
  }

  static get PersistStyleCodeRow() {
    return PERSIST_STYLE_CODE_ROW;
  }
  static get UpdatePaintSchedule() {
    return 'UpdatePaintSchedule';
  }

  static get GetPaintScheduleStyles() {
    return 'GetPaintScheduleStyles';
  }

  static get GetProgramColorsForScheduler() {
    return 'GetProgramColorsForScheduler';
  }

  static get GetColorRules() {
    return 'GetColorRules';
  }
}
