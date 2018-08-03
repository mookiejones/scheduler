import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Grid, Row, Col, Badge } from 'react-bootstrap';

const SettingsItem = ({ handleSettingsClick, ...props }) => {
  return (
    <Grid fluid style={{ marginRight: '0' }}>
      <Col className="pull-right">
        <a onClick={handleSettingsClick}>
          <FontAwesome name="sliders" size="lg" />
        </a>
      </Col>
    </Grid>
  );
};

SettingsItem.propTypes = {
  handleSettingsClick: PropTypes.func.isRequired
};

const SectionItem = ({ title, value }) => (
  <Col sm={2}>
    <span>{title}</span>
    <Badge>{value}</Badge>
  </Col>
);

const TopSection = ({ round, roundSummary, rows, handleSettingsClick }) => {
  if (round > 0) {
    const item = roundSummary[round];
    return (
      <Grid fluid>
        <Row>
          {/* <div className="row topSection"> */}
          <SectionItem title="Round:" value={item['round']} />
          <SectionItem title="Build Count:" value={item['build_count']} />
          <SectionItem
            title="Carrier Removal:"
            value={item['carrier_removal']}
          />
          <SectionItem title="Tray Counter" value={item['tray_counter']} />
          <SectionItem title="Rows" value={rows} />

          <SettingsItem
            handleSettingsClick={handleSettingsClick}
            className="float-right"
          />
        </Row>
      </Grid>
    );
  } else {
    return (
      <div
        style={{
          width: '100%',
          height: '50px',
          backgroundColor: 'rgb(249, 249, 249)',
          margin: 'auto'
        }}
      />
    );
  }
};

TopSection.propTypes = {
  rows: PropTypes.number,
  roundSummary: PropTypes.any,
  round: PropTypes.any,
  handleSettingsClick: PropTypes.func.isRequired
};
TopSection.defaultProps = {
  roundSummary: [],
  round: -1
};

export default TopSection;
