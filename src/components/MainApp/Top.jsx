import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import { VERSION } from '../../shared/Constants/';

import { Badge, Nav, Navbar, NavItem } from 'react-bootstrap';
import Logo from '../Logo';

const Top = ({ routes, env, handleActive, ...props }) => {
  const status = /development/i.test(env) ? 'Test' : '';
  // Used to Style the active Link
  const activeStyle = {
    fontWeight: 'bold'
  };
  return (
    <Fragment>
      <Navbar
        fixedTop
        style={{
          backgroundColor: '#FFF',
          backgroundImage: 'none',
          border: '1px solid transparent'
        }}
        fluid
        bsStyle="default">
        <Navbar.Header>
          <Navbar.Brand>
            <Logo />
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Text className="pull-right">
          {status} <Badge>{VERSION}</Badge>
        </Navbar.Text>
        <Nav activeKey={1} className="pull-right">
          {routes.map((route, idx) => (
            <NavItem
              eventKey={idx}
              key={route.path}
              title={route.title}
              componentClass="p">
              <NavLink
                to={route.path}
                others={props}
                {...props}
                activeStyle={activeStyle}
                isActive={handleActive}>
                {route.title}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Navbar>
      <div style={{ marginTop: '40px' }} />
    </Fragment>
  );
};

export default Top;
