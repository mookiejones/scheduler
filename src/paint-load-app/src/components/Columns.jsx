import UndoCell from "./UndoCell";
import Description from "./Description";
import Calculator from "./Calculator";
import RackOwner from "./RackOwner";
import HammerRow from "./HammerRow";

const Columns = [
  /* eslint-disable */
  {
    title: "",
    data: "undo",
    className: "undo",
    orderable: false,
    CellRenderer: UndoCell,
    visible: false
  },
  { title: "master_id", data: "master_id", visible: false, orderable: false },
  { title: "round", data: "round", visible: false, orderable: true },
  { title: "round pos", data: "round_pos", visible: false, orderable: true },
  {
    title: "Description",
    data: "description",
    className: "tap",
    orderable: false,
    CellRenderer: Description
  },
  { title: "notes", data: "notes", visible: false, orderable: false },
  { title: "Color", data: "color", className: "tap", orderable: false },
  {
    title: "Mold Skin Style",
    data: "mold_skin_style",
    className: "tap",
    orderable: false
  },
  {
    title: "Rework Color Chart",
    data: "rework_color_chart",
    className: "tap",
    orderable: false
  },
  { title: "Quantity", data: "quantity", className: "tap", orderable: false },
  {
    title: "",
    data: null,
    className: "action",
    orderable: false,
    visible: true,
    CellRenderer: Calculator
  },
  { data: "ten", visible: false },
  {
    title: "StagedBy",
    data: "staged_by",
    visible: false,
    className: "tap",
    orderable: false
  },
  {
    title: "handledBy",
    data: "handled_by",
    visible: false,
    className: "tap",
    orderable: false
  },
  {
    title: "Picked By",
    data: "picked_by",
    className: "pickedBy tap",
    orderable: false,
    visible: true,
    CellRenderer: RackOwner
  }
  /* eslint-enable */
];

export default Columns;
