import * as http from "http";
const empty = {};
const getColors = () => {
  console.log("Getting Colors");
  const options = {
    method: "GET",
    port: 5555,
    path: "/api/colors",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let request = http
    .get(options, res => {
      const { statusCode } = res;
      const contentType = res.headers["content-type"];

      let error;
      if (statusCode !== 200) {
        error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(
          "Invalid content-type.\n" + `Expected application/json but received ${contentType}`,
        );
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        // res.resume();
        // return;
      }
      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", chunk => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData);
        } catch (e) {
          console.error(e.message);
        }
      });
    })
    .on("error", e => {
      console.error(`Got error: ${e.message}`);
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
