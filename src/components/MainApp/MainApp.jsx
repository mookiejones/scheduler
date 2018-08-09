import React, { Component } from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

import {
  PaintScheduleEditor,
  StyleCodeEditor,
  ProgramColorsEditor,
  ExcelImport,
  PaintApp,
  DriverPerformance
} from '../';
import { Grid, Row } from 'react-bootstrap';
// import LineView from '../LineView';

import Top from './Top';

export default class MainApp extends Component {
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
        render: () => <PaintScheduleEditor env={env} {...this.props} />
      },
      {
        title: 'Style Codes',
        key: 'style-codes',
        path: '/style-codes',
        component: StyleCodeEditor,
        render: () => <StyleCodeEditor env={env} {...this.props} />
      },
      {
        title: 'Program Colors',
        key: 'program-colors',
        path: '/program-colors',
        component: ProgramColorsEditor,
        render: () => <ProgramColorsEditor env={env} {...this.props} />
      },
      {
        title: 'Excel Import',
        key: 'excel-import',
        path: '/excel-import',
        component: ExcelImport,
        render: () => <ExcelImport env={env} {...this.props} />
      },
      {
        title: 'Paint App',
        key: 'paint-app',
        path: '/paint-app',
        component: PaintApp,
        render: () => <PaintApp env={env} {...this.props} />
      },
      {
        title: 'Driver Performance',
        key: 'driver-performance',
        path: '/driver-performance',
        component: DriverPerformance,
        render: ({ ...props }) => <DriverPerformance env={env} {...props} />
      }
    ];
    // ,
    //   {
    //     title: 'Line View',
    //     key: 'line-view',
    //     path: '/line-view',
    //     component: LineView,
    //     render: ({ ...props }) => <LineView env={env} {...props} />
    //   }
    return (
      <HashRouter>
        <Grid>
          <Row>
            <Top routes={routes} env={env} {...this.props} />
          </Row>
          <Row style={{ paddingTop: '20px' }}>
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
          </Row>
        </Grid>
      </HashRouter>
    );
  }
}
