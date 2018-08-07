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
export const INSERT = 'INSERT';

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
