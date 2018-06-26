import React, { Component } from "react";

import Navigation from "../components/Navigation";

export default class Header extends Component {
  render() {
    return (
      <div>
        <header id="masthead" className="site-header" role="banner">
          <Navigation />
        </header>
      </div>
    );
  }
}
