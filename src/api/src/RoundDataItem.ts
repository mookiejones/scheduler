class RoundDataItem {
  id: any;
  round: any;
  round_position: any;
  total_crs: any;
  program: any;
  mold_skin_style: any;
  assembly_flow: any;
  rework_color_chart: any;
  style_code: any;
  pieces: any;
  color: any;
  total_pcs: any;
  crs_real_time: any;
  mold_wip_density: any;
  add_take_off: any;
  customer: any;
  loc: any;
  notes: any;
  active: any;
  date_created: any;
  static Create(value: any) {
    const result = new RoundDataItem(value);
    return result;
  }

  /**
   * @param {*} value Returned JSON value for Round Data Item
   */
  constructor(value: any) {
    if (!value) {
      console.log("Round Data Item");
      return;
    }
    this.id = value.id || undefined;
    this.round = value.round || undefined;
    this.round_position = value.round_position || undefined;
    this.style_code = value.style_code || undefined;
    this.total_crs = value.total_crs || undefined;
    this.program = value.program || undefined;
    this.mold_skin_style = value.mold_skin_style || undefined;
    this.assembly_flow = value.assembly_flow || undefined;
    this.rework_color_chart = value.rework_color_chart || undefined;
    this.pieces = value.pieces || undefined;
    this.color = value.color || undefined;
    this.total_pcs = value.total_pcs || undefined;
    this.crs_real_time = value.crs_real_time || undefined;
    this.mold_wip_density = value.mold_wip_density || undefined;
    this.add_take_off = value.add_take_off || undefined;
    this.customer = value.customer || undefined;
    this.loc = value.loc || undefined;
    this.notes = value.notes || undefined;
    this.active = value.active || undefined;
    this.date_created = value.date_created || undefined;
  }
}

export default RoundDataItem;
