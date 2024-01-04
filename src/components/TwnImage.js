import React from "react";

function TwnImage({imageUrl, imageTitle, imageAlt}) {

    return (
        <div className="img-backdrop" style={{backgroundImage: `url(${imageUrl})`}}>
            <img src={imageUrl} title={imageTitle} alt={imageAlt} />
            <div className="img-title">{imageTitle}</div>
        </div>
    )
}

export default TwnImage
