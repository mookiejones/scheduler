import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTruck, faUndo, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';

export const TruckIcon = ({ ...props }) => (
  <FontAwesomeIcon icon={faTruck} {...props} />
);

export const UndoIcon = ({ ...props }) => (
  <FontAwesomeIcon icon={faUndo} {...props} />
);

export const CheckIcon = ({ ...props }) => (
  <FontAwesomeIcon icon={faCheckSquare} {...props} />
);

export const SlidersIcon = ({ ...props }) => (
  <FontAwesomeIcon icon={faSlidersH} {...props} />
);
