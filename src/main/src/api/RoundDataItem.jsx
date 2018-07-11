class RoundDataItem {
  static Create(value, rules) {
    const result = new RoundDataItem(value, rules);
    return result;
  }
  /**
   * @param {*} value Returned JSON value for Round Data Item
   */
  constructor(value, rules) {
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

    this.style = this.getStyling(rules);
  }
  getStyling(rules) {
    let style = {
      bgSuccess: { backgroundColor: "#dff0d8" },
      bgNormal: { backgroundColor: "#fff" }
    };
    for (let rule of rules) {
      if (rule.Contains) {
        let result = new RegExp(rule.Value, "i");
        if (result.test(this[rule.Element])) {
          style[rule.name] = { backgroundColor: rule.color };
        }
      }
    }

    return style;
  }
}

export default RoundDataItem;
