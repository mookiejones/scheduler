const DELETE_KEY: string = "DELETE";

enum ServerType {
  Local,
  Production,
  Test
}

const PRODUCTION: boolean = true;
const AVAILABLE: string = "##AVAILABLE##";
const VERSION_NUMBER: string = "1.3.1";

const GetServer=(type:ServerType)=>{
    switch(type){
      case ServerType.Local:
        return "http://localhost:5555";
        case ServerType.Production:
        return "http://nord:5555";
        case ServerType.Test:
        return "http://localhost:5555";



    }
}
/**
 * Number of seconds for data to refresh
 */
const REFRESH_RATE: number = 10;
let API_SERVER: string = "http://nord:5555";
if (!PRODUCTION) {
  API_SERVER = "http://localhost:5555";
}

export { DELETE_KEY, API_SERVER, AVAILABLE, REFRESH_RATE, VERSION_NUMBER, ServerType, GetServer };

