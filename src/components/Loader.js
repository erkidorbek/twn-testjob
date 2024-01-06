import React from 'react';
import loader from '../assets/loader.svg';

const Loader = () => {
  return (
    <div className="text-center">
      <img src={loader} alt="loading" title="loading" className="logo" />
    </div>
  );
};

export default Loader;
