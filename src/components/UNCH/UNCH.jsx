import React, { useContext } from "react";
import { UnchSettingsContext } from "../../App";
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
        <Switch
          onClick={hadnlePowerChange}
          isOn={isPowerOn}
          isUNCH
          imgClassName="unch-power-switch"
        />

        <Switch
          onClick={hadnleFilterChange}
          isOn={isFilterOn}
          isUNCH
          imgClassName="unch-filter-switch"
        />
      </div>
    </div>
  );
}

export default UNCH;
