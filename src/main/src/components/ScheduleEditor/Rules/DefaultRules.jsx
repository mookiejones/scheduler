const defaultRules = [
  {
    name: "success",
    type: "custom",
    value: (row) => row.id.substring(0, 4) === "TEMP",
    color: "#dff0d8"
  },
  {
    name: "normal",
    type: "custom",
    value: (row) => row.id.substring(0, 4) === "TEMP",
    color: "#ffffff"
  }
];

export default defaultRules;
