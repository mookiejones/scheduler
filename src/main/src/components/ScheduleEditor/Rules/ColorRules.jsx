import ColorRule from './ColorRule';

class ColorRules {
  getDefaultRules() {
    return [];
    // return [
    //   new ColorRule(null, 'color', 'service', 'service', '#ECEFF1!important', true),
    //   new ColorRule(null, 'notes', 'dontship', 'do not ship', '#FF1744!important', true),
    //   new ColorRule(null, 'notes', 'shipifgood', 'ship if good', '#81C784', true),
    //   new ColorRule(null, 'notes', 'build', 'build', '#FFF176', true),
    //   new ColorRule(null, 'id', 'bgSuccess', 'TEMP', '#dff0d8', null),
    //   new ColorRule(null, 'id', 'bgNormal', 'TEMP', '#FFFFFF', null),
    //   new ColorRule(null, 'notes', 'redhot', 'red hot', '#FF1744', true)
    // ];
  }

  parse(row) {
    const result = {};

    const results = this.rules.filter(o => o.IsValid(row));

    results.map(r => r.Name).forEach((n) => {
      result[n] = true;
    });
    return result;
  }

  add(rule) {
    this.rules.push(rule);
  }

  constructor() {
    this.rules = this.rules || this.getDefaultRules();
    this.styling = {
      bgSuccess: { backgroundColor: '#dff0d8' },
      bgNormal: { backgroundColor: '#FFFFFF' }
    };
    for (const rule of this.rules) {
      this.styling[rule.Name] = { backgroundColor: rule.Color };
    }
  }
}

// getRowFormat(row, index) {
//     const rowStyle = classnames({
//       "bg-success": row.id.substring(0, 4) === "TEMP",
//       "bg-normal": row.id.substring(0, 4) !== "TEMP",
//       service: row.color && row.color.includes("service"),
//       dontship: row.notes && row.notes.includes("do not ship"),
//       shipifgood: row.notes && row.notes.includes("ship if good"),
//       build: row.notes && row.notes.includes("build")
//     });
//     let result = [];
//     result.push(row.id.substring(0, 4) === "TEMP" ? "bg-success" : "bg-normal");
//     if (row.color && /service/i.test(row.color)) result.push("service");

//     if (row.notes) {
//       if (/do not ship/i.test(row.notes)) result.push("dontship");

//       if (/ship if good/i.test(row.notes)) result.push("shipifgood");

//       if (/build/i.test(row.notes)) result.push("build");
//     }
//     return result;
//   }

export { ColorRules, ColorRule };
