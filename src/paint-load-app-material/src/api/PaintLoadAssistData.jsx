import fetch from "node-fetch";
import { API_SERVER } from "../Constants";

const isArray = (item) => {
  return Object.prototype.toString.call(item) === "[object Array]";
};
const sortFn = (a, b) => {
  const roundA = parseInt(a[2], 10);
  const posA = parseInt(a[3], 10);
  const roundB = parseInt(b[2], 10);
  const posB = parseInt(b[3], 10);
  const qtyA = parseInt(a[9], 10);
  const qtyB = parseInt(b[9], 10);

  if (roundA === roundB) {
    // if round is the same, sort by round_position
    if (posA === posB) {
      if (qtyA < qtyB) {
        return -1;
      } else if (qtyA > qtyB) {
        return 1;
      }
      return 0;
    }
    return posA < posB ? -1 : 1;
  }
  return roundA < roundB ? -1 : 1;
};
class PaintLoadAssistData {
  static fetch(isTesting) {
    console.info(`Fetching PaintLoadData testing: ${isTesting}`);

    return fetch(
      `${API_SERVER}/reporting/paint.asmx/GetPaintLoadList? HTTP/1.1`
    )
      .then((e) => e.json())
      .then((e) => {
        let result = e.sort(sortFn);

        return isArray(result) && isArray(result[1]) && result[0].length > 2
          ? {
              data: result.map((item) => {
                return {
                  id: item[0],
                  master_id: item[1],
                  round: item[2],
                  round_pos: item[3],
                  description: item[4],
                  notes: item[5],
                  color: item[6],
                  mold_skin_style: item[7],
                  rework_color_chart: item[8],
                  quantity: item[9],
                  ten: item[10],
                  staged_by: item[11],
                  handled_by: item[12],
                  picked_by: item[13],
                  extra1: item[14],
                  extra2: item[15]
                };
              }),
              currentRoundNumber: result[0][2]
            }
          : {};
      })
      .catch((e) => {
        debugger;
      });

    // let srtdData = arr.sort(sortFn);
    // if(Object.prototype.toString.call(srtdData)==="[object Array]" && Object.prototype.toString.call(srtdData[0])==="[object Array]" && srtdData[0].length > 2) {
    //   this.setState({
    //     data: srtdData,
    //     currentRoundNumber: srtdData[0][2]
    //   });
  }
}
export default PaintLoadAssistData;
