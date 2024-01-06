import React from 'react';

const TwnImage = ({ imageUrl, imageTitle, imageAlt }) => {
  return (
    <div className="img-backdrop">
      <div className="blurred-img-backdrop">
        <div className="blurred-img" style={{ backgroundImage: `url(${imageUrl})` }}></div>
      </div>
      <img src={imageUrl} title={imageTitle} alt={imageAlt} />
      <div className="img-title">{imageTitle}</div>
    </div>
  );
};

export default TwnImage;
