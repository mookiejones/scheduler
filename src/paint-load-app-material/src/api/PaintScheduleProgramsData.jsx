class PaintScheduleProgramsData {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }
    const result = new PaintScheduleProgramsData([]);
    return result;
  }

  constructor(value) {
    this.rows = value;
    this.originalRows = value;
  }
}

export default PaintScheduleProgramsData;
