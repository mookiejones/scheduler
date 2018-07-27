const ruleTypes = ['includes', 'equals'];

export default class RowColorRules {

    get default() {
        return [{
                name: "bg-success",
                search: "TEMP",
                obj: "id",
                type: 'includes',
                value: ''
            }

        ]

    }
    constructor() {
        this.rules = [];
    }
    addIncludes(name, search, obj, value) {
        let rule = {
            name: name,
            search: search,
            obj: obj,
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