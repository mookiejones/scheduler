export const defaultKeys = ["id", "round", "round_position", "style_code", "total_crs", "program", "mold_skin_style", "assembly_flow", "rework_color_chart", "pieces", "color", "total_pcs", "crs_real_time", "mold_wip_density", "add_take_off", "customer", "loc", "notes", "active", "date_created", "isSelected"];

/**
 * @class RoundDataItem
 */
export default class RoundDataItem {

    constructor(item) {
        if (!item) {
            this.id = null;
            this.round = null;
            this.round_position = null;
            this.style_code = null;
            this.total_crs = null;
            this.program = null;
            this.mold_skin_style = null;
            this.assembly_flow = null;
            this.rework_color_chart = null;
            this.pieces = null;
            this.color = null;
            this.total_pcs = null;
            this.crs_real_time = null;
            this.mold_wip_density = null;
            this.add_take_off = null;
            this.customer = null;
            this.loc = null;
            this.notes = null;
            this.active = null;
            this.date_created = null;
            this.isSelected = false;
        } else {
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
}