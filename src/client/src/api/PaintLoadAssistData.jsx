import DataItemBase from "./DataItemBase";

class PaintLoadAssistData extends DataItemBase {
  static fetch(isTesting) {
    console.info(`Fetching PaintLoadData testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintLoadData");
    }
    const json = DataItemBase.api.paint_load_assist_data;
    const result = new PaintLoadAssistData(json);
    return result;
  }

  constructor(value) {
    super();
    this.rows = value;
    this.originalRows = value;
  }
}
export default PaintLoadAssistData;
