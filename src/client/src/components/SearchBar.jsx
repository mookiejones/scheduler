import React, { Component } from "react";
import { FormGroup, FormControl, Button, InputGroup, Glyphicon } from "react-bootstrap";

export default class SearchBar extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: "" };
  }

  getValidationState = () => {
    const length = this.state.value.length;
    if (length > 10) return "success";
    else if (length > 5) return "warning";
    else if (length > 0) return "error";
    return null;
  };
  handleChange(e) {
    this.setState({ value: e.target.value });
  }
  render() {
    return (
      <form>
        <FormGroup validationState={this.getValidationState()}>
          <InputGroup>
            <InputGroup.Addon>
              <Glyphicon glyph="search" />
            </InputGroup.Addon>

            <FormControl
              type="text"
              placeholder="Search"
              onKeyUp={this.onKeyUp}
              value={this.state.value}
              onChange={this.handleChange}
            />
          </InputGroup>
        </FormGroup>

        {/* <Button type="submit">Search</Button> */}
      </form>
    );
  }
}
