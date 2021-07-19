import React from "react";

import TA57Img from "../../assets/images/TA-57.jpg";

import "./TA57.css";

function TA57({ otherProps }) {
  return (
    <div className="TA-57-container">
      <img src={TA57Img} className="TA-57-img" />
      <div className="TA-57-pressable" {...otherProps} />
    </div>
  );
}

export default TA57;
