import UndoCell from "./UndoCell";
import Description from "./Description";
import Calculator from "./Calculator";
import RackOwner from "./RackOwner";
import HammerRow from "./HammerRow";

const Columns = [
  /* eslint-disable */
  {
    title: "",
    data: 0,
    className: "undo",
    orderable: false,
    CellRenderer: UndoCell,
  },
  { title: "master_id", data: 1, visible: false, orderable: false },
  { title: "round", data: 2, visible: false, orderable: true },
  { title: "round pos", data: 3, visible: false, orderable: true },
  {
    title: "Description",
    data: 4,
    className: "tap",
    orderable: false,
    CellRenderer: Description,
  },
  { title: "notes", data: 5, visible: false, orderable: false },
  { title: "Color", data: 6, className: "tap", orderable: false },
  { title: "Mold Skin Style", data: 7, className: "tap", orderable: false },
  { title: "Rework Color Chart", data: 8, className: "tap", orderable: false },
  { title: "Quantity", data: 9, className: "tap", orderable: false },
  {
    title: "",
    data: null,
    className: "action",
    orderable: false,
    visible: true,
    CellRenderer: Calculator,
  },
  { data: 10, visible: false },
  {
    title: "StagedBy",
    data: 11,
    visible: false,
    className: "tap",
    orderable: false,
  },
  {
    title: "handledBy",
    data: 12,
    visible: false,
    className: "tap",
    orderable: false,
  },
  {
    title: "Picked By",
    data: 13,
    className: "pickedBy tap",
    orderable: false,
    visible: true,
    CellRenderer: RackOwner,
  },
  /* eslint-enable */
];

export default Columns;
