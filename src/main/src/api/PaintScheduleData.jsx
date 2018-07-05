
import DataItemBase from "./DataItemBase";
import RoundDataItem from "./RoundDataItem";
import RoundSummaryItem from "./RoundSummaryItem";

const compare = (a, b) => {
  const first = parseInt(a.round, 10);
  const second = parseInt(b.round, 10);

  let result = first > second ? 1 : -1;

  if (first === second) result = 0;

  return result;
};

class PaintScheduleData extends DataItemBase {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);
    
    let url = super.url;

    return DataItemBase.getData("GetPaintSchedule")
    .then(o=>new PaintScheduleData(o))
    .catch(o=>{
      debugger;
    });

    // if (!isTesting) {
    //   throw new Error("Need to resolve the real data for PaintScheduleData");
    // }
    // const json = data.get_paint_schedule;
    // const result = new PaintScheduleData(json);
    // return result;
  }
  constructor(value) {
    super();
    const roundData = value.result[0] || [];
    const roundSummaryData = value.result[1] || [];

    this.RoundData = roundData.map(item => RoundDataItem.Create(item));
    this.RoundSummaryData = roundSummaryData.map(RoundSummaryItem.Create);

    this.selectedRound = null;
    if (this.RoundSummaryData.length > 0) {
      this.selectedRound = this.RoundSummaryData[this.RoundSummaryData.length - 1].round;
    }

    this.summary = {};

    this.RoundSummaryData.sort(compare).forEach((item) => {
      this.summary[item.round] = item;
    });
  }
}

export default PaintScheduleData;
