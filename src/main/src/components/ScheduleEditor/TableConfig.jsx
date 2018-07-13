const headers = [
  {
    value: 'round',
    format: 'number',

    title: 'Round',
    type: 'ReadOnly',
    width: 65,
    numeric: true,
    padding: 'dense'
  },
  {
    value: 'style_code',
    format: 'number',

    title: 'Style Code',
    type: 'TextField',
    width: 90,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'pieces',
    format: 'number',

    title: 'PPC',
    type: 'TextField',
    width: 50,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'assembly_flow',
    format: 'text',

    title: 'Assembly Flow',
    type: 'TextField',
    width: 125,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'program',
    format: 'text',

    title: 'Program',
    type: 'TextField',
    width: 125,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'mold_skin_style',
    format: 'text',

    title: 'MoldSkin/Style',
    type: 'TextField',
    width: 225,
    numeric: false,
    padding: 'default'
  },
  {
    value: 'notes',
    title: 'Notes',
    format: 'text',

    type: 'TextField',
    width: 250,
    numeric: false,
    padding: 'default'
  },
  {
    value: 'rework_color_chart',
    format: 'text',

    title: 'Rework Color Chart',
    type: 'TextField',
    width: 200,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'color',
    title: 'Color',
    format: 'text',

    type: 'TextField',
    width: 125,
    numeric: false,
    padding: 'default'
  },
  {
    value: 'add_take_off',
    title: 'ATO',
    format: 'text',

    type: 'TextField',
    width: 50,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'total_crs',
    title: 'Total Crs',
    format: 'text',

    type: 'TextField',
    width: 75,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'total_pcs',
    title: 'Total PCS',
    format: 'text',

    type: 'TextField',
    width: 90,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'customer',
    title: 'Customer',
    type: 'TextField',
    format: 'text',

    width: 100,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'crs_real_time',
    title: 'CRS',
    format: 'text',

    type: 'TextField',
    width: 150,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'wip_density',
    title: 'WIP Density',
    type: 'TextField',
    format: 'text',

    width: 110,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'loc',
    title: 'WIP Location',
    type: 'TextField',
    format: 'text',

    width: 200,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'assy_build_option',
    title: 'Build Option',
    format: 'text',

    type: 'TextField',
    width: 150,
    numeric: false,
    padding: 'none'
  }
];

export { headers };
