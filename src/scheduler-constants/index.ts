const DELETE_KEY: string = "DELETE";

const PRODUCTION: boolean = true;
const AVAILABLE: string = "##AVAILABLE##";
const VERSION_NUMBER: string = "1.3.1";
/**
 * Number of seconds for data to refresh
 */
const REFRESH_RATE: number = 10;
let API_SERVER: string = "http://nord:5555";
if (!PRODUCTION) {
  API_SERVER = "http://localhost:5555";
}

export { DELETE_KEY, API_SERVER, AVAILABLE, REFRESH_RATE, VERSION_NUMBER };
