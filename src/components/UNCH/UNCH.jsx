import React, { useContext, useRef } from "react";
import { IsUNCHConnectedContext, UnchSettingsContext } from "../../App";

import "./UNCH.css";

export const UnchType = {
  UNCH: "unch",
  TLF: "tlf",
};

function UNCH() {
  const {
    unchSettings: {
      isPowerOn = false,
      isFilterOn = false,
      volumeLevel = 5,
      unchType = UnchType.TLF,
      isMtgConnected = false,
      isTurnedOn = false,
    },
    setUnchSettings,
  } = useContext(UnchSettingsContext);
  const { isUNCHConnected, setIsUNCHConnected } = useContext(
    IsUNCHConnectedContext
  );

  const hadnlePowerChange = () => {
    setUnchSettings({
      isPowerOn: !isPowerOn,
      isFilterOn,
      volumeLevel,
      unchType,
      isMtgConnected,
      isTurnedOn,
    });
  };

  const hadnleFilterChange = () => {
    setUnchSettings({
      isPowerOn,
      isFilterOn: !isFilterOn,
      volumeLevel,
      unchType,
      isMtgConnected,
      isTurnedOn,
    });
  };

  const handleVolumeLevelChange = (value) => {
    setUnchSettings({
      isPowerOn,
      isFilterOn,
      volumeLevel: value,
      unchType,
      isMtgConnected,
      isTurnedOn,
    });
  };

  const handleUnchTypeChange = () => {
    setUnchSettings({
      isPowerOn,
      isFilterOn,
      volumeLevel,
      unchType: unchType === UnchType.TLF ? UnchType.UNCH : UnchType.TLF,
      isMtgConnected,
      isTurnedOn,
    });
  };

  const hadnleMtgChange = () => {
    setUnchSettings({
      isPowerOn,
      isFilterOn,
      volumeLevel,
      unchType,
      isMtgConnected: !isMtgConnected,
      isTurnedOn,
    });
  };

  const hadnleTurnedOnChange = () => {
    setUnchSettings({
      isPowerOn,
      isFilterOn,
      volumeLevel,
      unchType,
      isMtgConnected,
      isTurnedOn: !isTurnedOn,
    });
  };

  const soundEl = useRef();
  var mouseDown = useRef(false);
  var prevDeg = useRef(0);

  let counter = useRef(150);

  const handleMouseMove = (evt) => {
    if (mouseDown.current) {
      let center_x =
        soundEl.current.offsetLeft +
        soundEl.current.offsetParent.offsetLeft +
        soundEl.current.clientWidth / 2;
      let center_y =
        soundEl.current.offsetTop +
        soundEl.current.offsetParent.offsetTop +
        soundEl.current.clientHeight / 2;
      let mouse_x =
        evt.pageX ||
        (evt.changedTouches ? evt.changedTouches[0].pageX : undefined);
      let mouse_y =
        evt.pageY ||
        (evt.changedTouches ? evt.changedTouches[0].pageY : undefined);
      let radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
      let degree = radians * (180 / Math.PI) * -1 + 90;

      if (Math.round(prevDeg.current) !== Math.round(degree)) {
        if (prevDeg.current < degree && counter.current < 300) {
          ++counter.current;
        } else if (prevDeg.current > degree && counter.current > 0) {
          --counter.current;
        }

        if (counter.current > 0 && counter.current < 300) {
          handleVolumeLevelChange(Math.abs(counter.current / 300));
          const style = `
          -moz-transform: rotate(${degree}deg);
          -webkit-transform: rotate(${degree}deg);
          -o-transform: rotate(${degree}deg);
          -ms-transform: rotate(${degree}deg);
          `;
          soundEl.current.style = style;
          prevDeg.current = degree;
        }
      }
    }
  };

  const handleMouseDown = () => {
    mouseDown.current = true;
  };

  const handleMouseUp = () => {
    mouseDown.current = false;
    prevDeg.current = 0;
  };

  return (
    <div
      className="unch-wrapper"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <div className="unch-background">
        <span className="unch-text description-text">
          УНЧ
          <br />
          N0000
          <br />
          5A
        </span>
        <div className="unch-closed-pin first-pin">
          <div className="unch-closed-pin-small" />
        </div>
        <div className="unch-closed-pin second-pin">
          <div className="unch-closed-pin-small" />
        </div>
        <span className="unch-text filter-text">ФИЛЬТР</span>
        <span className="unch-text filter-on-text">ВКЛ</span>
        <div
          className={`unch-switch-container filter-switch ${
            isFilterOn ? "unch-switch-container__on" : ""
          }`}
          onClick={hadnleFilterChange}
        >
          <div className="unch-switch-pin switch-top switch-left" />
          <div className="unch-switch-pin switch-top switch-right" />
          <div className="unch-switch-pin switch-bottom switch-left" />
          <div className="unch-switch-pin switch-bottom switch-right" />
          <div className="unch-sitch-foundation">
            <div className="unch-sitch-handle">
              <div className="handle-block" />
            </div>
          </div>
        </div>
        <span className="unch-text power-on-text">ВКЛ</span>
        <div
          className={`unch-switch-container on-off-switch ${
            isTurnedOn ? "unch-switch-container__on" : ""
          }`}
          onClick={hadnleTurnedOnChange}
        >
          <div className="unch-switch-pin switch-top switch-left" />
          <div className="unch-switch-pin switch-top switch-right" />
          <div className="unch-switch-pin switch-bottom switch-left" />
          <div className="unch-switch-pin switch-bottom switch-right" />
          <div className="unch-sitch-foundation">
            <div className="unch-sitch-handle">
              <div className="handle-block" />
            </div>
          </div>
        </div>
        <span className="unch-text power-volt-text">12В</span>
        <div className="unch-power-foundation" onClick={hadnlePowerChange}>
          <div className="unch-switch-pin switch-top switch-left" />
          <div className="unch-switch-pin switch-top switch-right" />
          <div className="unch-switch-pin switch-bottom switch-left" />
          <div className="unch-switch-pin switch-bottom switch-right" />
          <div className="unch-power-input" />
          <div
            className={`power-fork ${isPowerOn ? "power-fork__visible" : ""}`}
          >
            <div className="power-cable" />
          </div>
        </div>
        <span className="unch-text sound-text">ГРОМК</span>
        <div
          className="unch-sound-container"
          ref={soundEl}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="unch-sound-line sound-line-top" />
          <div className="unch-sound-line sound-line-left" />
          <div className="unch-sound-line sound-line-right" />
        </div>
        <span className="unch-text pin-out-text">ВЫХ</span>
        <span className="unch-text klemm-text">┴</span>
        <div className="small-pin small-pin-out">
          <div className="small-pin-inner-line" />
          <div className="small-pin-inner" />
        </div>
        <span className="unch-text pin-unch-text">УНЧ</span>
        <div className="small-pin small-pin-unch">
          <div className="small-pin-inner-line" />
          <div className="small-pin-inner" />
        </div>
        <span className="unch-text station-input-text">РС</span>
        <div
          className="interface-input-container input-station"
          onClick={() => setIsUNCHConnected(!isUNCHConnected)}
        >
          <div className="interface-input-socket">
            <div className="interface-input-hole" />
            <div className="interface-input-hole-small hole-top hole-center" />
            <div className="interface-input-hole-small hole-top hole-left" />
            <div className="interface-input-hole-small hole-top hole-right" />
            <div className="interface-input-hole-small hole-bottom hole-left" />
            <div className="interface-input-hole-small hole-bottom hole-right" />
          </div>

          <div className="unch-switch-pin switch-top switch-left" />
          <div className="unch-switch-pin switch-top switch-right" />
          <div className="unch-switch-pin switch-bottom switch-left" />
          <div className="unch-switch-pin switch-bottom switch-right" />

          <div
            className={`connected-unch-block ${
              isUNCHConnected ? "connected-unch-block__visible" : ""
            }`}
          >
            <div className="connected-unch-short" />
            <div className="connected-unch-long" />
          </div>
        </div>
        <span className="unch-text mtg-input-text">МТГ</span>
        <div
          className="interface-input-container input-mtg"
          onClick={hadnleMtgChange}
        >
          <div className="interface-input-socket">
            <div className="interface-input-hole" />
            <div className="interface-input-hole-small hole-top hole-center" />
            <div className="interface-input-hole-small hole-top hole-left" />
            <div className="interface-input-hole-small hole-top hole-right" />
            <div className="interface-input-hole-small hole-bottom hole-left" />
            <div className="interface-input-hole-small hole-bottom hole-right" />
          </div>

          <div className="unch-switch-pin switch-top switch-left" />
          <div className="unch-switch-pin switch-top switch-right" />
          <div className="unch-switch-pin switch-bottom switch-left" />
          <div className="unch-switch-pin switch-bottom switch-right" />

          <div
            className={`connected-mtg-block ${
              isMtgConnected ? "connected-mtg-block__visible" : ""
            }`}
          >
            <div className="connected-mtg-short" />
            <div className="connected-mtg-long" />
          </div>
        </div>
        <span className="unch-text on-off-unch-text">УНЧ</span>
        <span className="unch-text on-off-Tlf-text">Тлф</span>
        <div
          className={`small-switch-container ${
            unchType === UnchType.UNCH ? "small-switch-container__on" : ""
          }`}
          onClick={handleUnchTypeChange}
        >
          <div className="small-switch-handle">
            <div className="small-switch-handle-block" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UNCH;
