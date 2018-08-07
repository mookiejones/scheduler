import PropTypes from 'prop-types';

const RowPropType = PropTypes.shape({
  id: PropTypes.number,
  color: PropTypes.string,
  date_grabbed: PropTypes.any,
  date_staged: PropTypes.any,
  date_handled: PropTypes.any,
  grab_by: PropTypes.string,
  handled_by: PropTypes.string,
  loc: PropTypes.any,
  master_id: PropTypes.number,
  mold_skin_style: PropTypes.string,
  notes: PropTypes.string,
  program: PropTypes.string,
  quantity: PropTypes.string,
  rework_color_chart: PropTypes.string,
  round: PropTypes.number,
  round_position: PropTypes.number,
  staged_by: PropTypes.string
});
export { RowPropType };
