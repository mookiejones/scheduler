import DataItemBase from './DataItemBase';
import RoundDataItem from './RoundDataItem';
import RoundSummaryItem from './RoundSummaryItem';
import { Constants } from '../Constants';

const compare = (a, b) => {
  const first = parseInt(a.round, 10);
  const second = parseInt(b.round, 10);

  let result = first > second ? 1 : -1;

  if (first === second) result = 0;

  return result;
};

class PaintScheduleData extends DataItemBase {
  static fetch(rules) {
    // console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    return DataItemBase.getData(Constants.GetPaintSchedule)
      .then(o => new PaintScheduleData(o, rules))
      .then(o => o)
      .catch((error) => {
        debugger;
        console.error(error);
      });
  }

  constructor(value, rules) {
    super();
    const roundData = value.result[0] || [];
    const roundSummaryData = value.result[1] || [];

    this.RoundData = roundData.map(item => RoundDataItem.Create(item, rules));
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
