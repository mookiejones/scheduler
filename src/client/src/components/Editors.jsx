import React from 'react';
import { Editors, Formatters} from 'react-data-grid-addons';

const { AutoComplete: AutoCompleteEditor, DropDownEditor } = Editors;
const { DropDownFormatter } = Formatters;

const CUSTOMER_OPTIONS = [
  { id: 'GM', title: 'GM' },
  { id: 'FCA', title: 'FCA' },
  { id: 'Ford', title: 'Ford' },
  { id: 'Honda', title: 'Honda' },
  { id: 'BMW', title: 'BMW' }
];
const ASSEMBLY_FLOW_OPTIONS = [
  { id: '130Area', title: '130 Area' },
  { id: 'Hercules', title: 'Hercules' },
  { id: 'Reindeer', title: 'Reindeer' },
  { id: 'Load Trays', title: 'Load Trays' }
];
const LOCATION_OPTIONS = [
  { id: 'OutsideService', title: 'Outside Service' },
  { id: 'MainWIP', title: 'Main WIP' },
  { id: 'ExpansionWIP', title: 'Expansion WIP' },
  { id: 'TJCellWIP', title: 'TJ Cell WIP' },
  { id: 'CompStore', title: 'Comp Store' },
  { id: 'OutsideorMasking', title: 'Outside or Masking' },
  { id: 'MaskingWIP', title: 'Masking WIP' },
  { id: 'Trays', title: 'Trays' },
  { id: 'Rework/Comp Store', title: 'Rework/Comp Store' },
  { id: 'AskMoldingforLocation', title: 'Ask Molding for Location' },
  { id: 'TJCellorExpansion', title: 'TJ Cell or Expansion' },
  { id: 'MainWIPorExpansion', title: 'Main WIP or Expansion' }
];

const CustomerOptionsEditor = <AutoCompleteEditor options={CUSTOMER_OPTIONS}/>;
const AssemblyFlowOptionsEditor = <AutoCompleteEditor options={ASSEMBLY_FLOW_OPTIONS}/>;
const LocationOptionsEditor = <AutoCompleteEditor options={LOCATION_OPTIONS}/>;

export {CustomerOptionsEditor, AssemblyFlowOptionsEditor, LocationOptionsEditor}
