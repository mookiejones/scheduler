import * as data from "./data.json";

/**
 * StyleCodeDataItem
 */
class StyleCodeDataItem {
  /**
   * @class StyleCodeDataItem
   * @param {*} value
   */
  static Create(value) {
    const result = new StyleCodeDataItem(value);
    return result;
  }

  /**
   * @param {*} value Returned JSON value for Round Data Item
   */
  constructor(value) {
    this.id = value.id || undefined;
    this.programname = value.programname || undefined;
    this.description = value.description || undefined;
    this.PartsPerCarrier = value.PartsPerCarrier || undefined;
    this.comments = value.comments || undefined;
    this.program_id = value.program_id || undefined;
    this.customer = value.customer || undefined;
    this.mold_wip_rack_density = value.mold_wip_rack_density || undefined;
    this.mold_wip_location = value.mold_wip_location || undefined;
    this.assembly_flow = value.assembly_flow || undefined;
    this.primary_bag = value.primary_bag || undefined;
    this.secondary_bag = value.secondary_bag || undefined;
  }
}

class PaintScheduleStylesData {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }
    const json = data.style_codes;
    const result = new PaintScheduleStylesData(json);
    return result;
  }

  /**
   *
   * @param {*} value
   */
  constructor(value) {
    this.data = value.map(StyleCodeDataItem.Create);
  }
}

export default PaintScheduleStylesData;
