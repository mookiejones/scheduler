import DataItemBase from './DataItemBase';

const isArray = item => Object.prototype.toString.call(item) === '[object Array]';

export default class PaintStageData extends DataItemBase {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error('Need to resolve the real data for PaintScheduleData');
    }
    const json = DataItemBase.api.paint_stage_data;
    const result = new PaintStageData(json);
    return result;
  }

  constructor(value) {
    super();

    const result = value.sort(DataItemBase.sort);

    if (isArray(result) && isArray(result[1]) && result[0].length > 2) {
      // this.rows = srtdData;
      this.data = result.map(item => ({
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
        stage_id: item[14],
        handle_id: item[15],
        pick_id: item[16],
        extra1: item[17],
        extra2: item[18]
      }));
      // this.originalRows = value;

      this.currentRoundNumber = result[0][2];
    } else {
      this.data = [];
      this.currentRoundNumber = 0;
    }

    // if (srtdData.length > 0) {
    //   _this6.setState({
    //     data: srtdData,
    //     currentRoundNumber: srtdData[0][2]
    //   });
    // }
  }
}
