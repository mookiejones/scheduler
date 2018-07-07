import * as http from "http";
const empty = {};

const bgSuccess = (row) => row.id.substring(0, 4) === "TEMP";
const bgNormal = (row) => row.id.substring(0, 4) !== "TEMP";
const service = (row) => row.color && /service/i.test(row.color);
const dontship = (row) => row.notes && /do not ship/i.test(row.notes);
const shipifgood = (row) => row.notes && /ship if good/i.test(row.notes);
const build = (row) => row.notes && /build/i.test(row.notes);
const redhot = (row) => row.notes && /red hot/i.test(row.notes);

const getColors = () => {
  return new Promise((resolve, reject) => {
    resolve([
      {
        title: "success",
        eval: bgSuccess,
        style: {
          backgroundColor: "#dff0d8"
        }
      },
      {
        title: "normal",
        eval: bgNormal,
        style: {
          backgroundColor: "#fff"
        }
      },
      {
        title: "service",
        eval: service,
        style: {
          backgroundColor: "#ECEFF1"
        }
      },
      {
        title: "dontship",
        eval: dontship,
        style: {
          fontWeight: "bold",
          color: "#FFF!important",
          backgroundColor: "#FF1744"
        }
      },
      {
        title: "shipifgood",
        eval: shipifgood,
        style: {
          fontWeight: "bold",
          backgroundColor: "#81C784"
        }
      },
      {
        title: "build",
        eval: build,
        style: {
          fontWeight: "bold",
          backgroundColor: "#FFF176"
        }
      },
      {
        title: "redhot",
        eval: redhot,
        style: {
          fontWeight: "bold",
          backgroundColor: "#FF1744!important",
          color: "white",
          display: "inline-block!important",
          borderRadius: "4px",
          paddingLeft: "8px",
          paddingRight: "8px"
        }
      }
    ]);
  });
};
const getColor = (row, index) => {
  debugger;
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
