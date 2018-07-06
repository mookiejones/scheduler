import   React, { Component}  from "react";
import {
    List,
    ListItem

} from "@material-ui/core"
import SettingsComponent from "./SettingsComponent"
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles= theme =>({
});
class RulesTest extends Component {
render(){
const { classes} = this.props;
return (<SettingsComponent/>);
}
}

export default withStyles(styles)(RulesTest)