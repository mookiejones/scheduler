class PaintScheduleStyleDataItem {
  id: any;
  program: any;
  value: any;
  text: any;
  title: any;

  /**
   * @class StyleCodeDataItem
   * @param {*} value
   */
  static Create(value: any) {
    const result = new PaintScheduleStyleDataItem(value);
    return result;
  }

  /**
   * @param {*} value Returned JSON value for Round Data Item
   */
  constructor(value: any) {
    this.id = value.id;
    this.program = value.program;
    this.value = value.id;
    this.text = value.program;
    this.title = value.program;
  }
}

class PaintScheduleStylesData {
  static fetch(isTesting: boolean) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }

    const result = new PaintScheduleStylesData([]);
    return result;
  }
  programs: Array<any> = [];
  /**
   *
   * @param {*} value
   */
  constructor(value: any) {
    this.programs = value.map(PaintScheduleStyleDataItem.Create);
  }
}

export default PaintScheduleStylesData;
