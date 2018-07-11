import React, { Component } from "react";
import PropTypes from "prop-types";
import ExcelImport from "../components/ExcelImport/ExcelImport";

const ExcelImportContainer = ({ ...props }) => <ExcelImport {...props} />;

ExcelImportContainer.propTypes = {
  route: PropTypes.number.isRequired
};
export default ExcelImportContainer;
