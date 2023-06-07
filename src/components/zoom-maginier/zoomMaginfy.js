/**
 * This method is used to zoom image in scale method
 */
import React, { useRef, useState } from "react";
import PREVIEW from "../../assets/no_preview.png";
import "./style.scss";

function zoomMaginfy(props) {
  const [zoomBackgroundPos, setZoomBackgroundPos] = useState({ x: 0, y: 0 });
  const magnifierRef = useRef(null);

  const handleMouseMove = (event) => {
    const rect = magnifierRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setZoomBackgroundPos({ x: -x * 2, y: -y * 2 });
  };

  return (
    <div className="zoom-maginify-container">
     
      <img
        src={props.image }
        alt="No Image"
        onError={(e) => (e.target.src = PREVIEW)}
        className={`${props.zoomClass} maginify-product-zoom` }
      />
      {props.isVisible ? (
        <>
          <div
            className="magnifier"
            ref={magnifierRef}
            onMouseMove={handleMouseMove}
          >
          <div
            className="zoom"
            style={{
              backgroundImage: `url(${props.image})`,
              backgroundPosition: `${zoomBackgroundPos.x}px ${zoomBackgroundPos.y}px`,
            }}
          />
          </div>
        </>
      ) : null}
    </div>
  );
}

export default zoomMaginfy;
