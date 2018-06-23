import React, { Component } from "react";
import { Nav, Navbar, FormGroup, FormControl, Button } from "react-bootstrap";
import CollapsingNavItemWithIcon from "../components/CollapsingNavItemWithIcon";
import SearchBar from "../components/SearchBar";
import classnames from "classnames";
import FontAwesome from "react-fontawesome";
export default class Header extends Component {
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
      <div>
        <header id="masthead" className="site-header" role="banner">
          <div className="nav-container">
            <nav
              id="site-navigation"
              className="main-navigation"
              role="navigation"
            >
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
                      <div className="function">
                        <form
                          role="search"
                          method="get"
                          id="searchform"
                          className="search-form"
                          action="https://colorlib.com/shapely/"
                        >
                          <label className="screen-reader-text">
                            Search for:
                          </label>
                          <input
                            type="text"
                            placeholder="Type Here"
                            value=""
                            name="s"
                            id="s"
                          />
                          <button type="submit" className="searchsubmit">
                            <i className="fa fa-search" aria-hidden="true" />
                            <span className="screen-reader-text">Search</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </header>
      </div>
    );
  }
}
