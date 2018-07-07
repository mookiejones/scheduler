import DataItemBase from "./DataItemBase";

const sortFn = function (a, b) {
  const roundA = parseInt(a[2], 10);
  const posA = parseInt(a[3], 10);
  const roundB = parseInt(b[2], 10);
  const posB = parseInt(b[3], 10);
  const qtyA = parseInt(a[9], 10);
  const qtyB = parseInt(b[9], 10);

  if (roundA === roundB) {
    // if round is the same, sort by round_position
    if (posA === posB) {
      return qtyA < qtyB ? -1 : qtyA > qtyB ? 1 : 0;
    }
    return posA < posB ? -1 : 1;
    // return (posA < posB) ? -1 : (posA > posB) ? 1 : 0;
  }
  return roundA < roundB ? -1 : 1;
};
export default class PaintStageData extends DataItemBase {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }
    const json = DataItemBase.api.paint_stage_data;
    const result = new PaintStageData(json);
    return result;
  }

  constructor(value) {
    super();

    const srtdData = value.sort(sortFn);
    if (srtdData.length > 0) {
      // this.rows = srtdData;
      this.data = srtdData;
      // this.originalRows = value;
      this.currentRoundNumber = srtdData[0][2];
    }

    // if (srtdData.length > 0) {
    //   _this6.setState({
    //     data: srtdData,
    //     currentRoundNumber: srtdData[0][2]
    //   });
    // }
  }
}
