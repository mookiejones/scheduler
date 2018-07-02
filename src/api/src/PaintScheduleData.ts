import RoundDataItem from "./RoundDataItem";
import RoundSummaryItem from "./RoundSummaryItem";

const compare = (a: any, b: any) => {
  const first = parseInt(a.round, 10);
  const second = parseInt(b.round, 10);

  let result = first > second ? 1 : -1;

  if (first === second) result = 0;

  return result;
};

class PaintScheduleData {
  RoundData: any;
  RoundSummaryData: any;
  selectedRound: any;
  summary: any;
  static fetch(isTesting: boolean) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }

    const result = new PaintScheduleData();
    return result;
  }
  constructor() {
    debugger;
    let value: any = [];
    const roundData = value[0] || [];
    const roundSummaryData = value[1] || [];

    this.RoundData = roundData.map((item: any) => RoundDataItem.Create(item));
    this.RoundSummaryData = roundSummaryData.map(RoundSummaryItem.Create);

    this.selectedRound = null;
    if (this.RoundSummaryData.length > 0) {
      this.selectedRound = this.RoundSummaryData[
        this.RoundSummaryData.length - 1
      ].round;
    }

    this.summary = {};

    this.RoundSummaryData.sort(compare).forEach((item: any) => {
      this.summary[item.round] = item;
    });
  }
}

export default PaintScheduleData;
