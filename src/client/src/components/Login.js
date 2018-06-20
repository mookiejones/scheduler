import React, { Component, createRef } from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { FieldGroup } from "./FieldGroup";

const defaultOptions = {
  url: "",
  method: "POST",
  mode: "cors",
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
  body: null
};
const loginAction = (options) => {
  const header = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": options.content || "multipart/form-data"
  });
  const opt = Object.assign({}, defaultOptions, options);
  const sentData = {
    method: opt.method,
    mode: "cors",
    header,
    body: opt.body || ""
  };
  return new Promise((reslove, reject) => {
    fetch(opt.url, sentData)
      .then(response => response.json())
      .then((responseText) => {
        const resp = typeof responseText === "string" ? JSON.parse(responseText) : responseText;
        // console.log(resp);
        reslove(resp); // 这个resp会被外部接收
      })
      .catch((err) => {
        // console.log(err);
        reject(err);
      });
  }).catch((err) => {
    console.log(err);
  });
};
export class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.input = createRef();
    this.selectRole = createRef();
    this.focusTextInput = this.focusTextInput.bind(this);

    this.state = {
      disabled: false
    };
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.input.current.focus();
  }

  loginUser(e) {
    e.preventDefault();

    const userId = this.input.current.value;

    const role = this.selectRole.current.value;
    const request = new XMLHttpRequest();

    const options = {
      url: "/api/VerifyEmpID",
      content: "application/json; charset=UTF-8",
      method: "POST",
      body: {
        EmployeeID: userId
      }
    };

    const la = loginAction(options);

    la.then((result) => {}).catch((error) => {});

    request.open("POST", "http://norweb/reporting/paint.asmx/VerifyEmpID", true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        const temp = JSON.parse(request.response);
        const data = temp.d;

        if (data !== "-1" && data !== "0") {
          this.input.blur();
          this.setState({ disabled: true });
          this.props.setUser(userId, data, role);
        }
      } else {
        alert(request.response);
      }
    };
    request.onabort = (e) => {};

    request.onerror = (e) => {
      console.error(e);
    };
    request.send(JSON.stringify({ EmployeeID: userId }));
  }
  render() {
    return (
      <div className="login-wrapper" style={{ width: "250px", margin: "auto" }}>
        <form action="" className="form-signin">
          <h2 className="form-signin-heading">Please sign in</h2>

          <FieldGroup
            type="text"
            placeholder="Employee ID"
            id="inputId"
            pattern="[0-9]*"
            disabled={this.state.disabled}
            inputRef={this.input}
          />
          <FormGroup>
            <FormControl
              componentClass="select"
              disabled={this.state.disabled}
              inputRef={this.selectRole}
              id="selectRole"
            >
              <option value="assist">Load Assist</option>
              <option value="stage">Staging</option>
              <option value="load">Load</option>
            </FormControl>
          </FormGroup>
          <Button onClick={e => this.loginUser(e)} bsStyle="primary" block type="submit">
            Sign in
          </Button>
        </form>
      </div>
    );
  }
}
