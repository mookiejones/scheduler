import NotesFormatter from './NotesFormatter';

//Columns definition
const columns = [
  {
    key: 'round',
    name: 'Round',
    width: 65,
    editable: false,
    resizable: true,
    filterable: true
  },
  {
    key: 'style_code',
    name: 'Style Code',
    width: 90,
    editable: true,
    resizable: true,
    filterable: true
  },
  {
    key: 'pieces',
    name: 'PPC',
    width: 50,
    editable: true,
    resizable: true,
    filterable: true
  },
  {
    key: 'assembly_flow',
    name: 'Assembly Flow',
    width: 125,
    editable: true,
    resizable: true,
    filterable: true
  },
  {
    key: 'program',
    name: 'Program',
    editable: true,
    width: 125,
    resizable: true,
    filterable: true
  },
  {
    key: 'mold_skin_style',
    name: 'Mold Skin/Style',
    editable: true,
    width: 225,
    resizable: true,
    filterable: true
  },
  {
    key: 'notes',
    name: 'Notes',
    width: 250,
    editable: true,
    formatter: NotesFormatter,
    resizable: true,
    filterable: true
  },
  {
    key: 'rework_color_chart',
    name: 'Rework Color Chart',
    editable: true,
    width: 200,
    resizable: true,
    filterable: true
  },
  {
    key: 'color',
    name: 'Color',
    editable: true,
    width: 125,
    resizable: true,
    filterable: true
  },
  {
    key: 'add_take_off',
    name: 'ATO',
    width: 50,
    editable: true,
    resizable: true,
    filterable: true
  },
  {
    key: 'total_crs',
    name: 'Total Crs',
    width: 75,
    editable: true,
    resizable: true,
    filterable: true
  },
  {
    key: 'total_pcs',
    name: 'Total Pcs',
    width: 90,
    editable: true,
    resizable: true,
    filterable: true
  },
  {
    key: 'customer',
    name: 'Customer',
    editable: true,
    width: 100,
    resizable: true,
    filterable: true
  },
  {
    key: 'crs_real_time',
    name: 'Carriers Real Time',
    width: 150,
    editable: true,
    resizable: true,
    filterable: true
  },
  {
    key: 'mold_wip_density',
    name: 'WIP Density',
    width: 110,
    editable: true,
    resizable: true,
    filterable: true
  },
  {
    key: 'loc',
    name: 'WIP Location',
    width: 200,
    editable: true,
    resizable: true,
    filterable: true
  },
  {
    key: 'assy_build_option',
    name: 'Build Option',
    width: 150,
    editable: true,
    resizable: true,
    filterable: true
  }
];

export { columns };
