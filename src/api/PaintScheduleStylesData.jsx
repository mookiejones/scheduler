import DataItemBase from "./DataItemBase";

class PaintScheduleStyleDataItem {
  /**
   * @class StyleCodeDataItem
   * @param {*} value
   */
  static Create(value) {
    const result = new PaintScheduleStyleDataItem(value);
    return result;
  }

  /**
   * @param {*} value Returned JSON value for Round Data Item
   */
  constructor(value) {
    this.id = value.id;
    this.program = value.program;
    this.value = value.id;
    this.text = value.program;
    this.title = value.program;
  }
}

class PaintScheduleStylesData extends DataItemBase {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }
    // const json = DataItemBase.api.style_codes;
   const result = new PaintScheduleStylesData([]);
    return result;
  }

  /**
   *
   * @param {*} value
   */
  constructor(value) {
    super();

    this.programs = value.map(PaintScheduleStyleDataItem.Create);
  }
}

export default PaintScheduleStylesData;
