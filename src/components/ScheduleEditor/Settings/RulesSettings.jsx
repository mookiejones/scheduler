import   React, { Component}  from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles"
import * as PropTypes from 'prop-types';
import RuleComponent from "./RuleComponent"
import { Add } from "@material-ui/icons"
import {
    Button,
    Card,
    CardHeader,
    Grid,
    CardContent,
    Select,
    List,
    Input,
    ListItem,
    FormControl,
    TextField,
    InputLabel,
    MenuItem
} from "@material-ui/core"

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    fab:{
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    margin: {
      margin: theme.spacing.unit,
    },
    withoutLabel: {
      marginTop: theme.spacing.unit * 3,
    },
    textField: {
      flexBasis: 200,
    },
  });

   

class RuleSettings extends Component {
    constructor(props){
        super(props);
        this.onValueChanged=this.onValueChanged.bind(this);
    }
    onValueChanged(event,value){
        debugger;
    }
    render(){
        const { classes }= this.props;
        return (
            <Grid>
            <List>
                <RuleComponent title="test" value="equals" onValueChanged={this.onValueChanged}/>
                </List>
                <Button variant="fab" color="secondary" aria-label="Add" className={classes.fab}><Add/></Button>
                </Grid>
        )
    }
}

export default  withStyles(styles)(RuleSettings)