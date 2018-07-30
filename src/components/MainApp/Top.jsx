import React from 'react';
import { NavLink } from 'react-router-dom';

import { VERSION } from '../../shared/Constants';

import { Badge, Nav, Navbar, NavItem } from 'react-bootstrap';
import Logo from '../Logo';

const Top = ({ routes, env, handleActive, ...props }) => {
  const status = /development/i.test(env) ? 'Test' : '';
  // Used to Style the active Link
  const activeStyle = {
    fontWeight: 'bold'
  };
  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Logo />
        </Navbar.Brand>
      </Navbar.Header>
      <Nav activeKey={1}>
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
      <Navbar.Text>
        {status} <Badge>{VERSION}</Badge>
      </Navbar.Text>
    </Navbar>
  );
};

export default Top;
