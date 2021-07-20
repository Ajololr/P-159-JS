import React, { useContext, useEffect, useState } from "react";

import TlgKlemmImg from "../../assets/images/klemm-line.png";

import "./TlgKlemmKey.css";
import { IsTA57ConnectedContext, TlgKeyContext } from "../../App";

const TlgKlemmKey = ({ wrapperRef, ...otherProps }) => {
  const { tlgKey, setTlgKey } = useContext(TlgKeyContext);
  const { isTa57Connected, setTa57Connected } = useContext(
    IsTA57ConnectedContext
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderModal = () => (
    <div
      className={`modal-wrapper ${
        isModalVisible ? "modal-wrapper_visible" : ""
      }`}
    >
      <div className="modal-window">
        <h2 className="modal-header">Выберите действие</h2>
        <button onClick={tlgClickHandler} className="modal-option">
          Подключить телеграфный ключ
        </button>
        <button onClick={ta57ClickHandler} className="modal-option">
          Подключить ТА-57
        </button>
      </div>
    </div>
  );

  const klemmClickHandler = () => {
    if (tlgKey) {
      setTlgKey(false);
    } else if (isTa57Connected) {
      setTa57Connected(false);
    } else {
      setIsModalVisible(true);
    }
  };

  const tlgClickHandler = () => {
    setTlgKey(!tlgKey);
    setIsModalVisible(false);
  };

  const ta57ClickHandler = () => {
    setTa57Connected(!isTa57Connected);
    setIsModalVisible(false);
  };

  useEffect(() => {
    wrapperRef.current.style.overflowY = tlgKey ? "scroll" : "hidden";
  }, [wrapperRef, tlgKey]);

  return (
    <>
      <div className="klemm-line-container" onClick={klemmClickHandler}>
        <img className="klemm-line" src={TlgKlemmImg} />
        <div className={`key-fork ${tlgKey ? "key-fork__visible" : ""}`}>
          <div className="cable" />
        </div>
        <div
          className={`key-container ${tlgKey ? "key-container__visible" : ""}`}
        >
          <div className="key-block" />
          <div className="key-long" />
          <div className="key-button" {...otherProps} />
        </div>
        <div
          className={`key-fork ${isTa57Connected ? "key-fork__visible" : ""}`}
        >
          <div className="cable-ta" />
        </div>
      </div>
      {renderModal()}
    </>
  );
};

export default TlgKlemmKey;
