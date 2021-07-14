import * as React from "react";

import "./switch.css";

import activeImg from "./active.png";
import inactiveImg from "./inactive.png";

export const Switch = ({ onChange }) => {
  const [active, setActive] = React.useState(false);

  const onClickHandler = () => {
    setActive(!active);
    onChange(!active);
  };

  return (
    <img
      onClick={onClickHandler}
      className={`switch`}
      src={active ? activeImg : inactiveImg}
    />
  );
};
