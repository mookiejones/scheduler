import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  DialogTitle,
} from "@material-ui/core";
import { getColors } from "../Rules";
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class ColoringPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.rulesRetrieved = this.rulesRetrieved.bind(this);
  }
  rulesRetrieved(rules) {
    this.setState({ items: rules });
  }
  componentDidMount() {
    getColors()
      .then(this.rulesRetrieved)
      .catch(err => {
        debugger;
      });
  }
  render() {
    return (
      <TabContainer>
        <List>
          {this.state.items.map((rule, idx) => {
            return (
              <ListItem key={idx}>
                <Card>
                  <CardHeader>
                    <h1>{rule.title}</h1>
                  </CardHeader>
                  <CardContent>{rule.color}</CardContent>
                </Card>;
              </ListItem>
            );
          })}
        </List>
      </TabContainer>
    );
  }
}
export default class RulesDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event, value) {
    this.setState({ value: value });
  }
  render() {
    const { value } = this.state;

    return (
      <Dialog open={this.props.show} fullScreen>
        <DialogTitle>
          <DialogContentText>Edit Rules</DialogContentText>
          <DialogContent>
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Rules" />
              <Tab label="Rules" />
              <Tab label="Rules" />
            </Tabs>
            {value === 0 && <ColoringPage />}
            {value === 1 && <TabContainer>Item1</TabContainer>}
            {value === 2 && <TabContainer>Item 2</TabContainer>}
          </DialogContent>
        </DialogTitle>
      </Dialog>
    );
  }
}

RulesDialog.propTypes = {
  showSettings: PropTypes.bool,
};
