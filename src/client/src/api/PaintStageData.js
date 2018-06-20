import DataItemBase from "./DataItemBase";

let sortFn = function(a, b){
    let roundA = parseInt(a[2],10);
    let posA = parseInt(a[3],10);
    let roundB = parseInt(b[2],10);
    let posB = parseInt(b[3],10);
    let qtyA = parseInt(a[9],10);
    let qtyB = parseInt(b[9],10);
  
    if(roundA===roundB){
      //if round is the same, sort by round_position
      if(posA===posB){
        return (qtyA < qtyB) ? -1 : (qtyA > qtyB) ? 1 : 0;
      }else{
        return (posA < posB) ? -1 : 1;
        //return (posA < posB) ? -1 : (posA > posB) ? 1 : 0;
      }
    }else{
      return (roundA < roundB) ? -1 : 1;
    }
  };
class PaintStageData extends DataItemBase {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }
    const json = DataItemBase.api.paint_stage_data;
    const result = new DataItemBase(json);
    return result;
  }

  constructor(value) {
    super();
  
    debugger;
    var srtdData = value.sort(sortFn);
    if (srtdData.length > 0) {
      _this6.setState({
        data: srtdData,
        currentRoundNumber: srtdData[0][2]
      });
    }
  } else {}
  }
}
export default PaintStageData;
