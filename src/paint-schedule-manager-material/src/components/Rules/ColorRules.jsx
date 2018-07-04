import * as http from "http";
const empty = {};

const bgSuccess = row => row.id.substring(0, 4) === "TEMP";
const bgNormal = row => row.id.substring(0, 4) !== "TEMP";

const getColors = () => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        title: "success",
        eval: bgSuccess,
        color: "#dff0d8",
      },
      {
        title: "normal",
        eval: bgNormal,
        color: "#fff",
      },
    ]);
  });
};
const getColor = (row, index) => {
  // .bg-success > div {
  //     background-color: #dff0d8 !important; }

  //   .bg-normal {
  // background-color: #ffffff; }

  return empty;
};
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

export { getColor, getColors };
