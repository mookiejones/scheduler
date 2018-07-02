class RoundSummaryItem {
  round: any;
  carrier_removal: any;
  tray_counter: any;
  build_count: any;
  static Create(value: any) {
    const result = new RoundSummaryItem(value);
    return result;
  }

  /**
   * @class RoundSummaryItem
   * @param {*} value JSON Value for RoundSummaryItem
   */
  constructor(value: any) {
    this.round = value.round;
    this.carrier_removal = value.carrier_removal;
    this.tray_counter = value.tray_counter;
    this.build_count = value.build_count;
  }
}

export default RoundSummaryItem;
