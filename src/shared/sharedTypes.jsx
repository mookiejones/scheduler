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

const UserPropType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  img: PropTypes.string.isRequired,
  imgPath: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});
export { ColorPropType, UserPropType };
