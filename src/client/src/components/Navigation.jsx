import React, { Component } from "react";
import { Nav, Navbar, FormGroup, FormControl, Button } from "react-bootstrap";
import CollapsingNavItemWithIcon from "./CollapsingNavItemWithIcon";
import SearchBar from "./SearchBar";
import classnames from "classnames";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";

export default class Navigation extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      hovered: false
    };
  }
  render() {
    const items = [
      { href: "/ScheduleEditor", text: "Schedule Editor ", icon: "edit" },
      { href: "/ScheduleEditor2", text: "Schedule Editor2 ", icon: "edit" },
      { href: "/StyleCodes", text: "Style Codes ", icon: "qrcode" },
      { href: "/PaintApp", text: "Paint App ", icon: "paint-brush" },
      { href: "/ExcelImport", text: "Excel Import ", icon: "upload" },
      { href: "/DriverPerformance", text: "Driver Performance ", icon: "truck" }
    ];
    return (
      <div className="nav-container">
        <nav id="site-navigation" className="main-navigation" role="navigation">
          <div className="container nav-bar">
            <div className="flex-row">
              <div className="module left site-title-container">
                <a href="http://norweb" className="custom-logo-link">
                  <span className="site-title">Magna</span>
                </a>{" "}
              </div>
              <div className="module widget-handle mobile-toggle right visible-sm visible-xs">
                <i className="fa fa-bars" />
              </div>
              <div className="module-group right">
                <div className="module left">
                  <div className="collapse navbar-collapse navbar-ex1-collapse">
                    <ul id="menu" className="menu">
                      {items.map(item => (
                        <li
                          id="menu-item-1636"
                          key={item.text}
                          className="menu-item menu-item-type-custom menu-item-object-custom current-menu-item current_page_item menu-item-home menu-item-1636 active"
                        >
                          <a title={item.text} href={item.href}>
                            {item.text}
                            <FontAwesome name={item.icon} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="module widget-handle search-widget-handle hidden-xs hidden-sm">
                  <div className="search">
                    <i className="fa fa-search" />
                    <span className="title">Site Search</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

Navigation.propTypes = {
  hovered: PropTypes.bool.isRequired
};
