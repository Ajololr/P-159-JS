import React, { useContext } from "react";
import {
  IsUNCHConnectedContext,
  MicroContext,
  ModalSettingsContext,
} from "../../App";

import MicroImg from "../../assets/images/micro.png";

import "./Micro.css";

const Micro = () => {
  const { micro, setMicro } = useContext(MicroContext);
  const { isUNCHConnected, setIsUNCHConnected } = useContext(
    IsUNCHConnectedContext
  );
  const { setModalSettings } = useContext(ModalSettingsContext);

  const microClickHandler = () => {
    setMicro(true);
    setModalSettings({ isVisible: false });
  };

  const unchClickHandler = () => {
    setIsUNCHConnected(true);
    setModalSettings({ isVisible: false });
  };

  const clickHandler = () => {
    if (micro) {
      setMicro(false);
    } else if (isUNCHConnected) {
      setIsUNCHConnected(false);
    } else {
      setModalSettings({
        isVisible: true,
        title: "Выберите действие",
        actions: [
          {
            onClick: microClickHandler,
            title: "Подключить микротелефонную гарнитуру",
          },
          { onClick: unchClickHandler, title: "Подключить блок УНЧ" },
        ],
      });
    }
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
