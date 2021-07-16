import React, { useContext } from "react";

import TlgKlemmImg from "../../assets/images/klemm-line.png";

import "./TlgKlemmKey.css";
import { TlgKeyContext } from "../../App";

const TlgKlemmKey = () => {
  const { tlgKey, setTlgKey } = useContext(TlgKeyContext);

  const clickHandler = () => {
    setTlgKey(!tlgKey);
  };

  return (
    <div className="klemm-line-container" onClick={clickHandler}>
      <img className="klemm-line" src={TlgKlemmImg} />
      <div className={`key-fork ${tlgKey ? "key-fork__visible" : ""}`} />
      <div
        className={`key-container ${tlgKey ? "key-container__visible" : ""}`}
      >
        <div className="key-block" />
        <div className="key-long" />
        <div className="key-button" />
      </div>
    </div>
  );
};

export default TlgKlemmKey;
