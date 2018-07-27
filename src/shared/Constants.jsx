export const VERSION = '1.4';
export const DELETE = 'DELETE';
export const UPDATE = 'UPDATE';
export const INSERT = 'INSERT';

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
  static get ScheduleNewRound() {
    return SCHEDULE_NEW_ROUND;
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
