import { createContext, useEffect, useRef, useState } from "react";

import "./App.css";

import { Spinner } from "./components/spiner/spiner";
import { Button } from "./components/button/button";
import { TranseferTypeSwitch } from "./components/transeferTypeSwitch/transeferTypeSwitch";
import DistConrolImg from "./assets/images/dist-controll.png";
import PowerMetr from "./components/PowerMetr/PowerMetr";
import PowerSwitch from "./components/PowerSwitch/PowerSwitch";
import Micro from "./components/Micro/Micro";
import Antenna from "./components/Antenna/Antenna";

const spinnersControllsArray = [
  {
    min: 3,
    max: 7,
  },
  {
    min: 0,
    max: 9,
  },
  {
    min: 0,
    max: 9,
  },
  {
    min: 0,
    max: 9,
  },
  {
    min: 0,
    max: 9,
  },
];

export const TransferTypeContext = createContext();

export const TransferType = {
  tlg: "tlg",
  tlf: "tlf",
  tlfPh: "tlfPh",
  du: "du",
};

export const PowerContext = createContext();

export const PowerType = {
  off: "off",
  on: "on",
  setting: "setting",
};

export const MicroContext = createContext();

export const AntennaContext = createContext();

function App() {
  const [transferType, setTransferType] = useState(TransferType.tlg);
  const [power, setPower] = useState(PowerType.off);
  const [micro, setMicro] = useState(false);
  const [antenna, setAntenna] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState("30000");
  const [workingFreq, setWorkingFreq] = useState("30000");

  const prevPower = useRef(power);

  const freqSettingStartedHandler = () => {
    prevPower.current = power;
    if (power === PowerType.on) {
      setPower(PowerType.setting);
      setWorkingFreq(selectedFreq);
    }
  };

  const freqSettingEndedHandler = () => {
    setPower(prevPower.current);
  };

  useEffect(() => {
    // init socket io
  }, []);

  const sendAudioHandler = () => {
    // send audoi on button press
    console.log(
      JSON.stringify({ transferType, power, micro, antenna, workingFreq })
    );
  };

  return (
    <TransferTypeContext.Provider value={{ transferType, setTransferType }}>
      <PowerContext.Provider value={{ power, setPower }}>
        <MicroContext.Provider value={{ micro, setMicro }}>
          <AntennaContext.Provider value={{ antenna, setAntenna }}>
            <div className="wrapper">
              <div className="station">
                <div className="spinners_list">
                  {spinnersControllsArray.map((control, index) => (
                    <Spinner
                      min={control.min}
                      max={control.max}
                      onChange={(value) => {
                        setSelectedFreq(
                          selectedFreq.slice(0, index) +
                            value.toString() +
                            selectedFreq.slice(index + 1)
                        );
                      }}
                    />
                  ))}
                </div>
                <img src={DistConrolImg} className="dist_control_img" alt="" />
                <TranseferTypeSwitch selected={transferType} />
                <div className="buttons">
                  <Button onClick={sendAudioHandler} />
                  <Button
                    onMouseDown={freqSettingStartedHandler}
                    onMouseUp={freqSettingEndedHandler}
                  />
                </div>
                <PowerMetr />
                <PowerSwitch />
                <Micro />
                <Antenna />
              </div>
            </div>
          </AntennaContext.Provider>
        </MicroContext.Provider>
      </PowerContext.Provider>
    </TransferTypeContext.Provider>
  );
}

export default App;
