import React, { useContext } from "react";

import { PowerContext, PowerType } from "../../App";

import TurnedOnImage from "../../assets/images/turned-on.png";
import TurnedOffImage from "../../assets/images/turned-off.png";

import "./PowerSwitch.css";

const PowerSwitch = () => {
  const { power, setPower } = useContext(PowerContext);

  const clickHandler = () => {
    setPower(power === PowerType.off ? PowerType.on : PowerType.off);
  };

  return (
    <img
      alt=""
      onClick={clickHandler}
      src={power === PowerType.off ? TurnedOffImage : TurnedOnImage}
      className="turned-switch"
    />
  );
};

export default PowerSwitch;
