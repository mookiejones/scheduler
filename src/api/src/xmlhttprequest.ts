/// Type Definitions for xmlhttprequest

declare module "xmlhttprequest" {
  import * as xmlhttprequest from "xmlhttprequest";

  export interface RequestOptions {
    ignoreCache?: boolean;
    headers?: { [key: string]: string };
    // 0 (or negative) to wait forever
    timeout?: number;
  }

  export const DEFAULT_REQUEST_OPTIONS: RequestOptions;

  export interface RequestResult {
    ok: boolean;
    status: number;
    statusText: string;
    data: string;
    json: <T>() => T;
    headers: string;
  }

  function parseXHRResult(xhr: XMLHttpRequest): RequestResult;
}
