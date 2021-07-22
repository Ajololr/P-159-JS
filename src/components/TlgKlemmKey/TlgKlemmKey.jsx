import React, { useContext, useEffect } from "react";

import TlgKlemmImg from "../../assets/images/klemm-line.png";

import "./TlgKlemmKey.css";
import {
  IsTA57ConnectedContext,
  ModalSettingsContext,
  TlgKeyContext,
} from "../../App";

const TlgKlemmKey = ({ wrapperRef, ...otherProps }) => {
  const { tlgKey, setTlgKey } = useContext(TlgKeyContext);
  const { setModalSettings } = useContext(ModalSettingsContext);
  const { isTa57Connected, setTa57Connected } = useContext(
    IsTA57ConnectedContext
  );

  const tlgClickHandler = () => {
    setTlgKey(!tlgKey);
    setModalSettings({ isVisible: false });
  };

  const ta57ClickHandler = () => {
    setTa57Connected(!isTa57Connected);
    setModalSettings({ isVisible: false });
  };

  const klemmClickHandler = () => {
    if (tlgKey) {
      setTlgKey(false);
    } else if (isTa57Connected) {
      setTa57Connected(false);
    } else {
      setModalSettings({
        isVisible: true,
        title: "Выберите действие",
        actions: [
          {
            onClick: tlgClickHandler,
            title: "Подключить телеграфный ключ",
          },
          { onClick: ta57ClickHandler, title: "Подключить ТА-57" },
        ],
      });
    }
  };

  useEffect(() => {
    wrapperRef.current.style.overflowY = tlgKey ? "scroll" : "hidden";
  }, [wrapperRef, tlgKey]);

  return (
    <>
      <div className="klemm-line-container" onClick={klemmClickHandler}>
        <img className="klemm-line" src={TlgKlemmImg} alt="klemm line" />
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
    </>
  );
};

export default TlgKlemmKey;
