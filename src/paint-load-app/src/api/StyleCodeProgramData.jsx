class StyleCodeProgramData {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }

    const json = [];
    const result = new StyleCodeProgramData(json);
    return result;
  }

  constructor(data) {
    this.programs = data.map((item, index) => ({
      id: item.id,
      value: item.id,
      text: item.program,
      title: item.program,
    }));
  }
}

export default StyleCodeProgramData;
