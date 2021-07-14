import React, { useContext } from "react";

import { PowerContext, PowerType } from "../../App";

import PowerMetrImg from "../../assets/images/power-metr.png";

import "./PowerMetr.css";

const PowerMetr = () => {
  const { power } = useContext(PowerContext);

  let rotation;

  switch (power) {
    case PowerType.off:
      rotation = "-45deg";
      break;

    case PowerType.on:
      rotation = "10deg";
      break;

    case PowerType.setting:
      rotation = "50deg";
      break;

    default:
      rotation = "-45deg";
      break;
  }

  return (
    <div className="power-metr-wrapper">
      <img className="power-metr" src={PowerMetrImg} alt="" />
      <div
        className="power-metr__indicator"
        style={{ transform: `rotate(${rotation})` }}
      />
    </div>
  );
};

export default PowerMetr;
