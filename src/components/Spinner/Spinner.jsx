import * as React from "react";

import "./Spinner.css";

import FullImg from "./full.png";
import PartImg from "./part.png";

import SoundSpinnerImg from "../../assets/images/sound-switch.png";

export const Spinner = ({ min, max, onChange, isSound }) => {
  const [number, setNumber] = React.useState(min);

  const onClickHandler = () => {
    const newNumber = number + 1;
    if (newNumber > max) {
      setNumber(min);
      onChange(min);
    } else {
      setNumber(newNumber);
      onChange(newNumber);
    }
  };

  let image = isSound ? SoundSpinnerImg : min === 3 ? PartImg : FullImg;

  return (
    <img
      alt=""
      onClick={onClickHandler}
      className={`spinner`}
      style={{ transform: `rotate(${number * (360 / 12)}deg)` }}
      src={image}
    />
  );
};
