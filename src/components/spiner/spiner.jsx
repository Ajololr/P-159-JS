import * as React from "react";

import "./spinner.css";

import FullImg from "./full.png";
import PartImg from "./part.png";

export const Spinner = ({ min, max, onChange }) => {
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

  return (
    <img
      alt=""
      onClick={onClickHandler}
      className={`spinner`}
      style={{ transform: `rotate(${number * (360 / 12)}deg)` }}
      src={min === 3 ? PartImg : FullImg}
    />
  );
};
