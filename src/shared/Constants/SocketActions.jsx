const RowUpdate = 'rowupdate';
const RowDelete = 'rowdelete';
const NewRow = 'newrow';
const Disconnect = 'disconnect';
const Reconnect = 'reconnect';
const Connection = 'connection';
const UpdateNotify = 'update-notify';
const Login='login';
export default class SocketActions {
  static get Login(){
    return Login;
  }
  static get Connection() {
    return Connection;
  }
  static get UpdateNotify() {
    return UpdateNotify;
  }
  static get RowUpdate() {
    return RowUpdate;
  }
  static get RowDelete() {
    return RowDelete;
  }

  static get NewRow() {
    return NewRow;
  }
  static get Disconnect() {
    return Disconnect;
  }

  static get Reconnect() {
    return Reconnect;
  }
}
