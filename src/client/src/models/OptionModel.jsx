export default class RowColorRules {

  get default(){
      return [
          {name:"bg-success",search:"TEMP",obj:"id",type:},

      ]
      return {

        
      }
  }
  constructor() {
    this.rules = [];
  }
  addIncludes(name, search, obj) {
    let rule = {
      name: name,
      search: search,
      obj:obj,
      value: value,
      type: "includes"
    };

    // Check to see if this key exists allready
    let exists = this.rules.find(r => r.name === name);
    if (exists) {
      debugger;
    }

    this.rules.push(rule);
  }
}
 



let rowColorRules=new RowColorRules();
// Default Options for scheduler
const options = {
    defaultSortName: "mold_skin_style",
    defaultSortOrder: "desc",
    sortIndicator: false, // disable sort indicator,
    afterInsertRow: onAfterInsertRow,
    afterDeleteRow: onAfterDeleteRow,
    onRowClick: row => {},
    onRowDoubleClick: row => {},
    afterSearch: afterSearch, // define a after search hook,

    rowColorRules: rowColorRules
  };


class ScheduleEditorOptions {

    get default(){
        this.options=options;
    }
}