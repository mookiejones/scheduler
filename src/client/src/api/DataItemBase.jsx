import * as data from "./data.json";

export default class DataItemBase {
  static get api() {
    return data;
  }
}
