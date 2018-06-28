const DELETE_KEY = "DELETE";
const PRODUCTION = false;

let API_SERVER = "http://nord:5555";
if (!PRODUCTION) {
  API_SERVER = "http://localhost:5555";
}

console.log(API_SERVER);
export { DELETE_KEY, API_SERVER };
