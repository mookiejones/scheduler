class PaintLoadData {
  static fetch(isTesting) {
    console.info(`Fetching PaintLoadData testing: ${isTesting}`);

    if (!isTesting) {
      throw new Error("Need to resolve the real data for PaintLoadData");
    }

    const result = new PaintLoadData();
    return result;
  }
}
export default PaintLoadData;
