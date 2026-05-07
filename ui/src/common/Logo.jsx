import React from 'react';
import logo from '../assets/logo.svg';

const Logo = ({ width = 180, height = 'auto', style = {} }) => (
  <img
    src={logo}
    alt="Zentis AI Logo"
    width={width}
    height={height}
    style={{ display: 'block', ...style }}
  />
);

export default Logo; 