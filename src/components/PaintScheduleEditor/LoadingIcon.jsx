import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';

/**
 * @class LoadingIcon
 */
export default class LoadingIcon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      progress: 10,
      isMounted: false
    };
    this.updateTimer = this.updateTimer.bind(this);
  }

  updateTimer() {
    this.setState({ progress: this.state.progress + 1 });
  }

  componentDidMount() {
    if (this.interval == null)
      this.interval = setInterval(this.updateTimer, 0.01);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    // this.setState({ progress: 10 });
  }

  render() {
    // if (!this.props.loading) clearInterval(this.interval);

    const { progress } = this.state;
    return (
      <div className="progress">
        <ProgressBar
          now={progress}
          bsStyle="success"
          striped
          label={`Loading ${progress}%`}
        />
      </div>
    );
  }
}

LoadingIcon.propTypes = {
  loading: PropTypes.bool.isRequired
};
