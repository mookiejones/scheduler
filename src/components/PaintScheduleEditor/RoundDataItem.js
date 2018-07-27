export default class RoundDataItem {

    constructor(item) {
        this.id = item.id;
        this.round = item.round;
        this.round_position = item.round_position;
        this.style_code = item.style_code;
        this.total_crs = item.total_crs;
        this.program = item.program;
        this.mold_skin_style = item.mold_skin_style;
        this.assembly_flow = item.assembly_flow;
        this.rework_color_chart = item.rework_color_chart;
        this.pieces = item.pieces;
        this.color = item.color;
        this.total_pcs = item.total_pcs;
        this.crs_real_time = item.crs_real_time;
        this.mold_wip_density = item.mold_wip_density;
        this.add_take_off = item.add_take_off;
        this.customer = item.customer;
        this.loc = item.loc;
        this.notes = item.notes;
        this.active = item.active;
        this.date_created = item.date_created;
        this.isSelected = false;
    }
}