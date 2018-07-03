const DELETE_KEY = "DELETE";

const PRODUCTION = true;
const AVAILABLE = "##AVAILABLE##";
const VERSION_NUMBER = "1.3.1";
/**
 * Number of seconds for data to refresh
 */
const REFRESH_RATE = 10;
let API_SERVER = "http://nord:5555";
if (!PRODUCTION) {
  API_SERVER = "http://localhost:5555";
}

export { DELETE_KEY, API_SERVER, AVAILABLE, REFRESH_RATE, VERSION_NUMBER };
