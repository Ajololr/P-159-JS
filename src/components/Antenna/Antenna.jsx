import React, { useContext } from "react";
import { AntennaContext } from "../../App";

import AntennaImg from "../../assets/images/antenna.png";

import "./Antenna.css";

const Antenna = () => {
  const { antenna, setAntenna } = useContext(AntennaContext);

  const clickHandler = () => {
    setAntenna(!antenna);
  };

  return (
    <div className="antenna-container" onClick={clickHandler}>
      <img src={AntennaImg} className="antenna_img" alt="" />
      <div
        className={`antenna-block ${antenna ? "antenna-block__visible" : ""}`}
      >
        <div className="antenna-long" />
        <div className="antenna-short" />
      </div>
    </div>
  );
};

export default Antenna;
