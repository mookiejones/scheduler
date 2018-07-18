import UndoCell from './UndoCell';
import Description from './Description';
import Calculator from './Calculator';
import RackOwner from './RackOwner';

const Columns = [
  /* eslint-disable */
  {
    key: '0',
    title: '',
    data: 'undo',
    className: 'undo',
    orderable: false,
    CellRenderer: UndoCell,
    visible: true
  },
  { key: '1', title: 'master_id', data: 'master_id', visible: false, orderable: false },
  { key: '2', title: 'round', data: 'round', visible: false, orderable: true },
  { key: '3', title: 'round pos', data: 'round_pos', visible: false, orderable: true },
  {
    key: '4',
    title: 'Description',
    data: 'description',
    className: 'tap',
    visible: true,
    orderable: false,
    CellRenderer: Description
  },
  { key: '5', title: 'notes', data: 'notes', visible: false, orderable: false },
  { key: '6', title: 'Color', visible: true, data: 'color', className: 'tap', orderable: false },

  {
    key: '7',
    title: 'Mold Skin Style',
    data: 'mold_skin_style',
    className: 'tap',
    orderable: false,
    visible: true
  },
  {
    key: '8',
    title: 'Rework Color Chart',
    data: 'rework_color_chart',
    className: 'tap',
    orderable: false,
    visible: true
  },
  {
    key: '9',
    title: 'Quantity',
    visible: true,
    data: 'quantity',
    className: 'tap',
    orderable: false
  },
  {
    key: '10',
    title: '',
    data: null,
    className: 'action',
    orderable: false,
    visible: true,
    CellRenderer: Calculator
  },
  { key: '11', data: 'ten', visible: false },
  {
    key: '12',
    title: 'StagedBy',
    data: 'staged_by',
    visible: false,
    className: 'tap',
    orderable: false
  },
  {
    key: '13',
    title: 'handledBy',
    data: 'handled_by',
    visible: false,
    className: 'tap',
    orderable: false
  },
  {
    key: '14',
    title: 'Picked By',
    data: 'picked_by',
    className: 'pickedBy tap',
    orderable: false,
    visible: true,
    CellRenderer: RackOwner
  }
  /* eslint-enable */
];

export default Columns;
