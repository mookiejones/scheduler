import React, { Component } from 'react';
import { Route, HashRouter, Switch, NavLink } from 'react-router-dom';

// import PaintSchedule from './components/paint-schedule/paint-schedule';
// import PaintLine from './components/line-view/line-view';

import PaintScheduleEditor from './components/PaintScheduleEditor';
import StyleCodeEditor from './components/style-code-editor/StyleCodeEditor';
import ProgramColorsEditor from './components/ProgramColorsEditor';

import ExcelImport from './components/ExcelImport';
import PaintApp from './components/paint-load-app';
import DriverPerformance from './components/DriverPerformance/DriverPerformance';
import { VERSION } from './shared/Constants';
import { Badge, Nav, NavItem, Navbar } from 'react-bootstrap';
import Logo from './components/Logo';
const headerData = [
  {
    d:
      'M181.1,42.6h38l14,53h0.9c0.7-4.4,1.3-9.1,2.6-13.4l11.5-39.6h37.6l16.7,100.8h-35.7l-5-55.2h-0.7 c-0.7,3.3-1.3,6.8-2.4,10l-14.7,45.2h-21.6l-13.2-42.7c-1.1-4.3-2-8.3-2.3-12.6h-1.2c-0.3,4-0.5,8.2-0.9,12.2l-4.3,43.1h-35.7 L181.1,42.6z',
    color: '#dedede'
  },
  {
    d:
      'M332.7 143.4h-39.1L329 42.6h40.9l36.3 100.8H367l-3.4-12.6h-27.9L332.7 143.4zM357.1 106.9l-4.3-17.8c-1.1-4.3-1.8-8.7-2.4-13h-1.3l-6.7 30.8H357.1zM506.5 84c-.3 16.5-.3 30.2-12.3 43.1-10.8 11.6-27.4 17.9-43.2 17.9-31 0-56.1-19-56.1-51.4 0-32.9 24.4-52.7 56.4-52.7 17.7 0 41.9 8.7 49.9 25.9l-34.5 12.6c-2.8-5.1-8.1-7.8-14-7.8-13.2 0-20.5 11.2-20.5 23.4 0 11.1 7 21.5 19 21.5 5.8 0 13.2-2.7 15-8.8h-16.7V84H506.5zM509.3 42.6h35.5l33.2 55.9h1.1c-1.5-8.4-3.1-17.1-3.1-25.7V42.6h35.3v100.8h-35.3l-32.5-53h-1.1c1.2 7 2.3 13.5 2.3 20.2v32.8h-35.3V42.6z',
    color: '#dedede'
  },
  {
    d:
      'M646.7,143.4h-39.1l35.3-100.8h40.9L720,143.4h-39.1l-3.4-12.6h-27.9L646.7,143.4z M671.1,106.9l-4.3-17.8 c-1.1-4.3-1.7-8.7-2.4-13H663l-6.7,30.8H671.1z',
    color: '#dedede'
  },
  {
    d:
      'M82.3,0C72,0,63.7,8.3,63.7,18.5c0,10.2,8.3,18.5,18.6,18.5c10.3,0,18.6-8.3,18.6-18.5 C100.9,8.3,92.6,0,82.3,0',
    color: '#DA291C'
  },
  {
    d:
      'M108.3 143.5L146.6 143.5 109.7 42.8 81.6 42.8 76.5 56.8M0 143.5L57.1 143.5 28.5 65.7M63.6 143.5L101.9 143.5 65 42.8 37 42.8 31.8 56.8',
    color: '#0D0105'
  }
];

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

      <Nav>
        {routes.map((route) => (
          <li key={route.key}>
            <NavLink
              to={route.path}
              others={props}
              {...props}
              activeStyle={activeStyle}
              isActive={handleActive}>
              {route.title}
            </NavLink>
          </li>
        ))}
      </Nav>
      <Navbar.Text>
        {status} <Badge>{VERSION}</Badge>
      </Navbar.Text>
    </Navbar>
  );
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      env: /(?:localhost|test)/gi.test(window.location.href)
        ? 'development'
        : 'test',
      hide: false
    };
    this.handleActive = this.handleActive.bind(this);
  }
  componentWillMount() {
    this.handleActive = this.handleActive.bind(this);
  }
  handleActive(match, { pathname }) {
    if (!this.updater.isMounted(this)) return;
    debugger;
    const url = pathname.substring(1);
    const { hide } = this.state;
    const isPaint = url === 'paint-app';

    if (hide && !isPaint) this.setState({ hide: false });

    if (!hide && isPaint) this.setState({ hide: true });
  }
  render() {
    const { env } = this.state;
    const routes = [
      {
        title: 'Schedule Editor',
        key: 'edit',
        path: '/edit',
        component: PaintScheduleEditor,
        render: () => <PaintScheduleEditor env={env} />
      },
      {
        title: 'Style Codes',
        key: 'style-codes',
        path: '/style-codes',
        component: StyleCodeEditor,
        render: () => <StyleCodeEditor env={env} />
      },
      {
        title: 'Program Colors',
        key: 'program-colors',
        path: '/program-colors',
        component: ProgramColorsEditor,
        render: () => <ProgramColorsEditor env={env} />
      },
      {
        title: 'Excel Import',
        key: 'excel-import',
        path: '/excel-import',
        component: ExcelImport,
        render: () => <ExcelImport env={env} />
      },
      {
        title: 'Paint App',
        key: 'paint-app',
        path: '/paint-app',
        component: PaintApp,
        render: () => <PaintApp env={env} />
      },
      {
        title: 'Driver Performance',
        key: 'driver-performance',
        path: '/driver-performance',
        component: DriverPerformance,
        render: ({ ...props }) => <DriverPerformance env={env} {...props} />
      }
    ];
    return (
      <HashRouter>
        <div>
          <Top routes={routes} env={env} {...this.props} />

          <Switch>
            <Route exact path="/" render={routes[0].render} env={env} />
            {routes.map((route) => (
              <Route
                key={route.key}
                path={route.path}
                render={route.render}
                env={env}
              />
            ))}
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

// ReactDOM.render(<App />, mountNode);
