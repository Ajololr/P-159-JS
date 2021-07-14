import React, { useContext } from "react";
import { MicroContext } from "../../App";

import MicroImg from "../../assets/images/micro.png";

import "./Micro.css";

const Micro = () => {
  const { micro, setMicro } = useContext(MicroContext);

  const clickHandler = () => {
    setMicro(!micro);
  };

  return (
    <div className="micro-container" onClick={clickHandler}>
      <img src={MicroImg} className="micro_img" alt="" />
      <div className={`micro-block ${micro ? "micro-block__visible" : ""}`}>
        <div className="micro-short" />
        <div className="micro-long" />
      </div>
    </div>
  );
};

export default Micro;
