import React from "react";

import TA57Img from "../../assets/images/TA-57.jpg";

import "./TA57.css";

function TA57({ ...otherProps }) {
  return (
    <div className="TA-57-container">
      <img src={TA57Img} className="TA-57-img" alt="TA-57" />
      <div className="TA-57-phone-container">
        <div className="TA-57-phone-circle-big">
          <div className="TA-57-phone-circle-small" />
        </div>
        <div className="TA-57-phone-handle">
          <div className="TA-57-phone-button" {...otherProps} />
        </div>
        <div className="TA-57-phone-handle-small" />
        <div className="TA-57-phone-micro-big">
          <div className="TA-57-phone-micro-big-small" />
        </div>
      </div>
    </div>
  );
}

export default TA57;
