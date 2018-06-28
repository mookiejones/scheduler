const DELETE_KEY = "DELETE";

const PRODUCTION = true;

let API_SERVER = "http://nord:5555";
if (!PRODUCTION) {
  API_SERVER = "http://localhost:5555";
}

export { DELETE_KEY, API_SERVER };
