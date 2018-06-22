import { NotesFormatter } from "./NotesFormatter";
// Columns definition

const Columns = [
  /* eslint-disable */
  { key: "round", name: "Round", width: 65, editable: false },
  { key: "style_code", name: "StyleCode", width: 90, editable: true },
  { key: "pieces", name: "PPC", width: 50, editable: true },
  { key: "assembly_flow", name: "AssemblyFlow", width: 125, editable: true },
  { key: "program", name: "Program", editable: true, width: 125 },
  { key: "mold_skin_style", name: "MoldSkin/Style", editable: true, width: 225 },
  { key: "notes", name: "Notes", width: 250, editable: true, formatter: NotesFormatter },
  { key: "rework_color_chart", name: "ReworkColorChart", editable: true, width: 200 },
  { key: "color", name: "Color", editable: true, width: 125 },
  { key: "add_take_off", name: "ATO", width: 50, editable: true },
  { key: "total_crs", name: "TotalCrs", width: 75, editable: true },
  { key: "total_pcs", name: "TotalPcs", width: 90, editable: true },
  { key: "customer", name: "Customer", editable: true, width: 100 },
  { key: "crs_real_time", name: "CarriersRealTime", width: 150, editable: true },
  { key: "mold_wip_density", name: "WIPDensity", width: 110, editable: true },
  { key: "loc", name: "WIPLocation", width: 200, editable: true },
  { key: "assy_build_option", name: "BuildOption", width: 150, editable: true }
  /* eslint-enable */
];
export default Columns;
