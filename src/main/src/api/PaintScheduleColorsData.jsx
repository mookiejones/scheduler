import DataItemBase from "./DataItemBase";

class PaintScheduleColorsData extends DataItemBase {
  static fetch(isTesting) {
    console.info(`Fetching Paint Schedule Data testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintScheduleData");
    }

    // const json = DataItemBase.api.program_colors;
    const result = new PaintScheduleColorsData([]);
    return result;
  }

  constructor(data) {
    super();
    const hash = {};
    console.log("attempt to fix this");
    for (const x in data) {
      if (!hash[data[x].style_code]) {
        hash[data[x].style_code] = [];
      }
      hash[data[x].style_code].push({
        id: data[x].color_code,
        title: data[x].color_desc,
      });
    }
    this.hash = hash;
  }
}

export default PaintScheduleColorsData;
