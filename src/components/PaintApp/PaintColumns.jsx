import { UNDO_KEY, ROUND_KEY } from '../../shared';

import RackOwner from './RackOwner';
import Calculator from './Calculator';
import UndoCell from './UndoCell';
import Description from './Description';

/**
 * @class PaintColumn
 */
export class PaintColumn {
  constructor(data) {
    this.title = data.title || '';
    this.key = data.key || '';
    this.data = data.data || -1;
    this.className = data.className || '';
    this.orderable = data.orderable || false;
    this.visible = data.visible || false;
    this.CellRenderer = data.CellRenderer || null;
    this.style = data.style || {};
  }
}

// ReSharper disable once InconsistentNaming
const COLUMN_DEFINITIONS = [
  {
    title: '',
    key: 'id',
    data: 0,
    className: UNDO_KEY,
    orderable: false,
    visible: true,
    CellRenderer: UndoCell
  },
  {
    key: 'master_id',
    title: 'master_id',
    data: 1,
    visible: false,
    orderable: false
  },
  {
    key: ROUND_KEY,
    title: ROUND_KEY,
    data: 2,
    visible: false,
    orderable: true
  },
  {
    key: 'round_position',
    title: 'round pos',
    data: 3,
    visible: false,
    orderable: true
  },
  {
    key: 'program',
    title: 'Description',
    data: 4,
    className: 'tap',
    orderable: false,
    visible: true,
    CellRenderer: Description
  },
  {
    title: 'notes',
    key: 'notes',
    data: 5,
    visible: false,
    orderable: false
  },
  {
    title: 'Color',
    key: 'color',
    data: 6,
    className: 'tap',
    orderable: false,
    visible: true
  },
  {
    title: 'Mold Skin Style',
    key: 'mold_skin_style',
    data: 7,
    className: 'tap',
    orderable: false,
    visible: true
  },
  {
    title: 'Rework Color Chart',
    key: 'rework_color_chart',
    data: 8,
    className: 'tap',
    orderable: false,
    visible: true
  },
  {
    title: 'Quantity',
    key: 'quantity',
    data: 9,
    className: 'tap',
    orderable: false,
    visible: true
  },
  {
    title: '',
    data: null,
    className: 'action',
    orderable: false,
    visible: true,
    CellRenderer: Calculator,
    style: { width: '70px' }
  },
  { data: 10, visible: false, key: 'loc' },
  {
    title: 'StagedBy',
    data: 11,
    visible: false,
    className: 'tap',
    orderable: false,
    key: 'staged_by'
  },
  {
    title: 'handledBy',
    data: 12,
    visible: false,
    className: 'tap',
    orderable: false,
    key: 'handled_by'
  },
  {
    title: 'Picked By',
    data: 13,
    className: 'pickedBy tap',
    orderable: false,
    visible: true,
    CellRenderer: RackOwner,
    key: 'grab_by'
  }
];

const PaintColumns = COLUMN_DEFINITIONS.map((o) => new PaintColumn(o));

export default PaintColumns;
