import React from "react";
import { TextField, withStyles, Grid } from "@material-ui/core";

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  menu: {
    width: 200
  }
});
const DatePicker = ({ onChange, label, classes, time }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      className={classes.textField}
      InputLabelProps={{ shrink: true }}
      defaultValue={time}
      type="datetime-local"
      onChange={onChange}
    />
  </Grid>
);
export default withStyles(styles)(DatePicker);
