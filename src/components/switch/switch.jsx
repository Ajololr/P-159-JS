import React from "react";

import TurnedOnImage from "../../assets/images/turned-on.png";
import TurnedOffImage from "../../assets/images/turned-off.png";

import TurnedOnUNCHImage from "../../assets/images/switch-unch-on.jpg";
import TurnedOffUNCHImage from "../../assets/images/switch-unch-off.jpg";

function Switch({ onClick, isUNCH, isOn, imgClassName }) {
  const on = isUNCH ? TurnedOnUNCHImage : TurnedOnImage;
  const off = isUNCH ? TurnedOffUNCHImage : TurnedOffImage;

  return (
    <img
      alt=""
      onClick={onClick}
      src={isOn ? on : off}
      className={imgClassName}
    />
  );
}

export default Switch;
