/**
 * Values for the InputElements
 * value:key that we are pulling the data from'
 */

class InputHeaderConfig {
  constructor(item) {
    const keys = Object.keys(item);

    keys.forEach((key) => {
      this[key] = item[key];
    });
  }
}

const items = [
  {
    value: 'round',
    type: 'number',
    title: 'Round',
    readonly: true,
    width: 65,
    numeric: true,
    padding: 'dense'
  },
  {
    value: 'style_code',
    type: 'number',
    readonly: false,
    title: 'Style Code',
    width: 90,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'pieces',
    type: 'number',
    readonly: false,
    title: 'PPC',

    width: 50,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'assembly_flow',
    type: 'text',
    readonly: false,
    title: 'Assembly Flow',
    width: 125,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'program',
    type: 'text',
    readonly: false,
    title: 'Program',
    width: 125,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'mold_skin_style',
    type: 'text',
    readonly: false,
    title: 'MoldSkin/Style',
    width: 225,
    numeric: false,
    padding: 'default'
  },
  {
    value: 'notes',
    title: 'Notes',
    type: 'text',
    readonly: false,

    width: 250,
    numeric: false,
    padding: 'default'
  },
  {
    readonly: false,
    value: 'rework_color_chart',
    type: 'text',
    title: 'Rework Color Chart',
    width: 200,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'color',
    title: 'Color',
    type: 'text',
    readonly: false,

    width: 125,
    numeric: false,
    padding: 'default'
  },
  {
    value: 'add_take_off',
    title: 'ATO',
    type: 'text',

    width: 50,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'total_crs',
    title: 'Total Crs',
    type: 'text',

    width: 75,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'total_pcs',
    title: 'Total PCS',
    type: 'text',

    width: 90,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'customer',
    title: 'Customer',

    type: 'text',

    width: 100,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'crs_real_time',
    title: 'CRS',
    type: 'text',

    width: 150,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'wip_density',
    title: 'WIP Density',

    type: 'text',

    width: 110,
    numeric: true,
    padding: 'none'
  },
  {
    value: 'loc',
    title: 'WIP Location',

    type: 'text',

    width: 200,
    numeric: false,
    padding: 'none'
  },
  {
    value: 'assy_build_option',
    title: 'Build Option',
    type: 'text',

    width: 150,
    numeric: false,
    padding: 'none'
  }
];

const headers = items.map(item => new InputHeaderConfig(item));
export { headers };
