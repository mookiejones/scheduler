import React, { Component } from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';

import PaintScheduleEditor from '../PaintScheduleEditor';
import StyleCodeEditor from '../style-code-editor/StyleCodeEditor';
import ProgramColorsEditor from '../ProgramColorsEditor';

import ExcelImport from '../ExcelImport';
import PaintApp from '../paint-load-app';
import DriverPerformance from '../DriverPerformance/DriverPerformance';

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
