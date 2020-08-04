import React from 'react';
import icons from './iconsConfig';

export const Icon = ({ name, ...rest }) => {
  const TheIcon = icons[name];
  return <TheIcon {...rest} />;
};
export default Icon;
