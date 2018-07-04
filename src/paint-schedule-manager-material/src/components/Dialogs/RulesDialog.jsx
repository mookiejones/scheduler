import React, { Component } from "react";
import PropTypes from "prop-types";
import {Dialog , DialogActions,DialogContent,DialogContentText,DialogTitle} from "@material-ui/core";
export default class RulesDialog extends Component {

    render(){
        return (
            <Dialog>
                <DialogTitle>
                    <DialogContentText>Edit Rules</DialogContentText>
                </DialogTitle>
            </Dialog>
        )
    }
}