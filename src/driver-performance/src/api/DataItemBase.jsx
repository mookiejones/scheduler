import { API_SERVER } from "../Constants";
export default class DataItemBase {
  getData(type, params = {}) {
    debugger;
    const url = `${API_SERVER}/reporting/paint.asmx/${type}? HTTP/1.1`;
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open("GET", url, true);
      request.setRequestHeader(
        "Content-Type",
        "application/json; charset=UTF-8"
      );

      request.onload = () => {
        debugger;
        resolve(JSON.parse(request.response));
      };

      request.onabort = (e) => {
        debugger;
      };

      request.onerror = (e) => {
        console.error(e);
      };
      request.send(JSON.stringify({ params }));
    });
  }
}
