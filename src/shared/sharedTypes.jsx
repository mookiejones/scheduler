import PropTypes from 'prop-types';

const ColorPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    contains: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired
  })
);

export { ColorPropType };
