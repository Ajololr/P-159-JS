import React, { useContext } from "react";
import { UnchSettingsContext } from "../../App";
import { Spinner } from "../Spinner/Spinner";
import Switch from "../Switch/Switch";

import "./UNCH.css";

function UNCH() {
  const {
    unchSettings: { isPowerOn = false, isFilterOn = false },
    setUnchSettings,
  } = useContext(UnchSettingsContext);

  const hadnlePowerChange = () => {
    setUnchSettings({ isPowerOn: !isPowerOn, isFilterOn });
  };

  const hadnleFilterChange = () => {
    setUnchSettings({ isPowerOn, isFilterOn: !isFilterOn });
  };

  return (
    <div className="unch-wrapper">
      <div className="unch-background">
        <div className="unch-closed-pin first-pin">
          <div className="unch-closed-pin-small" />
        </div>
        <div className="unch-closed-pin second-pin">
          <div className="unch-closed-pin-small" />
        </div>
        <div className="unch-switch-container filter-switch">
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
        <div className="unch-power-foundation">
          <div className="unch-switch-pin switch-top switch-left" />
          <div className="unch-switch-pin switch-top switch-right" />
          <div className="unch-switch-pin switch-bottom switch-left" />
          <div className="unch-switch-pin switch-bottom switch-right" />
          <div className="unch-power-input" />
        </div>
        <div className="unch-sound-container">
          <div className="unch-sound-line sound-line-top" />
          <div className="unch-sound-line sound-line-left" />
          <div className="unch-sound-line sound-line-right" />
        </div>
        <div className="small-pin small-pin-out">
          <div className="small-pin-inner-line" />
          <div className="small-pin-inner" />
        </div>
        <div className="small-pin small-pin-unch">
          <div className="small-pin-inner-line" />
          <div className="small-pin-inner" />
        </div>
        <div className="interface-input-container input-station">
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
        </div>
        <div className="small-switch-container">
          <div className="small-switch-handle">
            <div className="small-switch-handle-block" />
          </div>
        </div>
        {/* <Switch
          onClick={hadnlePowerChange}
          isOn={isPowerOn}
          isUNCH
          imgClassName="unch-power-switch"
        /> */}
        {/* <Switch
          onClick={hadnleFilterChange}
          isOn={isFilterOn}
          isUNCH
          imgClassName="unch-filter-switch"
        /> */}
        {/* <div className="unch-sound-spinner">
          <Spinner isSound min={0} max={10} onChange={() => {}} />
        </div> */}
      </div>
    </div>
  );
}

export default UNCH;
