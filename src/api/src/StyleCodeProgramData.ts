class StyleCodeProgramData {
  programs: any;
  static fetch(isTesting: any) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }

    const json: Array<any> = [];
    const result = new StyleCodeProgramData(json);
    return result;
  }

  constructor(data: any) {
    this.programs = data.map((item: any, index: number) => ({
      id: item.id,
      value: item.id,
      text: item.program,
      title: item.program
    }));
  }
}

export default StyleCodeProgramData;
