import React from "react";
import { NotesFormatter } from "./NotesFormatter";
// Columns definition
import CreateNoteFormatter from "./CreateNoteFormatter";

const createNameEditor = (onUpdate, props) => (
  <CreateNoteFormatter onUpdate={onUpdate} {...props} />
);
const Columns = [
  /* eslint-disable */
  {
    key: "id",
    name: "Id",
    width: 0,
    editable: false,
    dataAlign: "left",
    isKey: true,
    dataSort: true,
    hidden: true,
    customEditor: null
  },
  {
    key: "round",
    name: "Round",
    width: 65,
    editable: false,
    dataAlign: "left",
    isKey: false,
    dataSort: true,
    hidden: false,
    customEditor: null
  },
  {
    key: "style_code",
    name: "StyleCode",
    width: 90,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: true,
    hidden: false,
    customEditor: null
  },
  {
    key: "pieces",
    name: "PPC",
    width: 50,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "assembly_flow",
    name: "AssemblyFlow",
    width: 125,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "program",
    name: "Program",
    editable: true,
    width: 125,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "mold_skin_style",
    name: "MoldSkin/Style",
    editable: true,
    width: 225,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "notes",
    name: "Notes",
    width: 250,
    editable: true,
    formatter: NotesFormatter,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: {
      getElement: createNameEditor
    }
  },
  {
    key: "rework_color_chart",
    name: "ReworkColorChart",
    editable: true,
    width: 200,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "color",
    name: "Color",
    editable: true,
    width: 125,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "add_take_off",
    name: "ATO",
    width: 50,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "total_crs",
    name: "TotalCrs",
    width: 75,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "total_pcs",
    name: "TotalPcs",
    width: 90,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "customer",
    name: "Customer",
    editable: true,
    width: 100,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "crs_real_time",
    name: "CarriersRealTime",
    width: 150,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "mold_wip_density",
    name: "WIPDensity",
    width: 110,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "loc",
    name: "WIPLocation",
    width: 200,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  },
  {
    key: "assy_build_option",
    name: "BuildOption",
    width: 150,
    editable: true,
    dataAlign: "left",
    isKey: false,
    dataSort: false,
    hidden: false,
    customEditor: null
  }
  /* eslint-enable */
];
export default Columns;
