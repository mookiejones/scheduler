import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import elementType from 'prop-types-extra/lib/elementType';

import { createBootstrapComponent } from './ThemeProvider';

class NavItem extends React.Component {
  static propTypes = {
    /**
     * @default 'nav-item'
     */
    bsPrefix: PropTypes.string,

    /** The ARIA role of the component */
    role: PropTypes.string,

    as: elementType
  };

  static defaultProps = {
    className: '',
    role: 'presentaton',
    as: 'li'
  };

  render() {
    const { bsPrefix, className, children, as, ...props } = this.props;

    return (
      <as {...props} className={classnames(className, bsPrefix)}>
        {children}
      </as>
    );
  }
}
export default NavItem;
// export default NavItem;
// export default createBootstrapComponent(NavItem, 'nav-item');
