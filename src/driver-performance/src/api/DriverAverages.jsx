import DataItemBase from "./DataItemBase";
import { API_SERVER } from "../Constants";
import * as fetch from "node-fetch";

export default class DriverAverages extends DataItemBase {
  static fetch(isTest, params) {
    let query = JSON.parse(params);
    let searchParams = new URLSearchParams();
    searchParams.append("startdate", params.startdate);
    searchParams.append("enddate", params.enddate);

    const url = `${API_SERVER}/reporting/paint.asmx/GetDriverAverages/startdate/${
      query.startdate
    }/enddate/${query.enddate}`;
    return fetch(url, {
      method: "POST",
      body: query
    }).then((result) => result.json());
  }
}