/**
 * @class User
 */
export default class User {
  constructor() {
    this._id = -1;
    this._name = '';
  }

  /**
   * Employee ID
   */
  get id() {
    return this._id;
  }

  /**
   * Employee ID
   */
  set id(value) {
    this._id = value;
  }

  /**
   * Employee Name
   */
  set name(value) {
    this._name = value;
  }

  /**
   * Employee Name
   */
  get name() {
    return this._name;
  }
}
