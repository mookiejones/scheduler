export default class PaintInfo {
  constructor(item) {
    this.id = item[0];
    this.master_id = item[1];
    this.round = item[2];
    this.round_pos = item[3];
    this.description = item[4];
    this.notes = item[5];
    this.color = item[6];
    this.mold_skin_style = item[7];
    this.rework_color_chart = item[8];
    this.quantity = item[9];
    this.ten = item[10];
    this.staged_by = item[11];
    this.handled_by = item[12];
    this.picked_by = item[13];
    this.extra1 = item[14];
    this.extra2 = item[15];
  }
}
