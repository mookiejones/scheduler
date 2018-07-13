import DataItemBase from './DataItemBase';

class PaintScheduleProgramsData extends DataItemBase {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error('Need to resolve the real data for PaintScheduleData');
    }
    const json = DataItemBase.api.programs;
    const result = new PaintScheduleProgramsData(json);
    return result;
  }

  constructor(value) {
    super();
    this.rows = value;
    this.originalRows = value;
  }
}

export default PaintScheduleProgramsData;
