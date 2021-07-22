import { createContext, useEffect, useRef, useState } from "react";
import { connect } from "socket.io-client";

import "./App.css";

import { Spinner } from "./components/spiner/spiner";
import { Button } from "./components/button/button";
import { TranseferTypeSwitch } from "./components/transeferTypeSwitch/transeferTypeSwitch";
import PowerMetr from "./components/PowerMetr/PowerMetr";
import Micro from "./components/Micro/Micro";
import Antenna from "./components/Antenna/Antenna";
import TlgKlemmKey from "./components/TlgKlemmKey/TlgKlemmKey";
import TA57 from "./components/TA57/TA57";
import UNCH from "./components/UNCH/UNCH";
import Modal from "./components/Modal/Modal";
import Switch from "./components/Switch/Switch";

let socket =
  process.env.NODE_ENV === "production"
    ? connect()
    : connect("https://localhost:2000");
const recordLength = 500;
const beepLength = 100;

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

export const TlgKeyContext = createContext();

export const IsTransferingContext = createContext();

export const IsTA57ConnectedContext = createContext();

export const IsUNCHConnectedContext = createContext();

export const ModalSettingsContext = createContext();

export const RoutesType = {
  P159: "P-159",
  UNCH: "UNCH",
  TA57: "TA-57",
};

export const RoutesContext = createContext();

export const UnchSettingsContext = createContext();

function App() {
  const [transferType, setTransferType] = useState(TransferType.tlf);
  const [power, setPower] = useState(PowerType.off);
  const prevPower = useRef(power);
  const [micro, setMicro] = useState(false);
  const [antenna, setAntenna] = useState(false);
  const [tlgKey, setTlgKey] = useState(false);
  const [isTa57Connected, setTa57Connected] = useState(false);
  const [isUNCHConnected, setIsUNCHConnected] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState("30000");
  const [workingFreq, setWorkingFreq] = useState(Math.random());
  const [isTransfering, setIsTransfering] = useState(false);
  const [modalSettings, setModalSettings] = useState({
    title: "",
    actions: [],
    isVisible: false,
  });
  const [unchSettings, setUnchSettings] = useState({
    isPowerOn: false,
    isFilterOn: false,
  });
  const [route, setRoute] = useState(RoutesType.P159);

  const isBroadcasting = useRef(false);
  const isBeep = useRef(false);
  const recorder = useRef(null);

  const beep = useRef();

  const wrapperRef = useRef();

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
    const init = async () => {
      recorder.current = await recordAudio("stream");
    };
    init();
  });

  const onStreamHandler = async (stream) => {
    if (!isBroadcasting.current && power === PowerType.on && antenna && micro) {
      if (stream.frequency === workingFreq)
        try {
          if (stream.beep && transferType === TransferType.tlg) {
            if (!isBeep.current) {
              beep.current.currentTime = 0.2;
              await beep.current.play();
              isBeep.current = true;
            } else {
              if (beep.current.currentTime > 595)
                beep.current.currentTime = 0.2;
            }
          } else if (isBeep.current) {
            stopBeep();
          }
          if (
            !stream.beep &&
            (transferType === TransferType.tlf ||
              transferType === TransferType.tlfPh ||
              (transferType === TransferType.du && isTa57Connected))
          ) {
            if (isBeep.current) {
              stopBeep();
            } else {
              if (!isBroadcasting.current) {
                const audioBlob = new Blob(Array(stream.audioChunks));
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                await audio.play();
              }
            }
          }
        } catch {}
    }
  };

  useEffect(() => {
    socket.off("stream");
    socket.on("stream", onStreamHandler);
  });

  const stopBeep = () => {
    beep.current.pause();
    beep.current.currentTime = 0;
    isBeep.current = false;

    setIsTransfering(false);
  };

  const broadcastingHandler = () => {
    if (antenna && micro && power === PowerType.on) {
      if (isBeep.current) stopBeep();
      isBroadcasting.current = true;
      setIsTransfering(true);
      broadcasting();
    }
  };

  const stationBroadcastHandler = () => {
    if (
      transferType === TransferType.tlf ||
      transferType === TransferType.tlfPh
    ) {
      broadcastingHandler();
    }
  };

  const ta57BroadcastHandler = () => {
    if (transferType === TransferType.du && isTa57Connected) {
      broadcastingHandler();
    }
  };

  function isNotBroadcasting() {
    isBroadcasting.current = false;
    setIsTransfering(false);
  }

  function isBroadcastingBeep() {
    if (
      antenna &&
      power === PowerType.on &&
      transferType === TransferType.tlg &&
      micro
    ) {
      if (isBeep.current) stopBeep();
      isBroadcasting.current = true;
      setIsTransfering(true);
      broadcastingBeep();
    }
  }

  function isNotBroadcastingBeep() {
    isBroadcasting.current = false;
    setIsTransfering(false);
  }

  const broadcasting = () => {
    if (isBroadcasting.current) {
      recorder.current.start();

      const interval = setInterval(async () => {
        await recorder.current.stop();
        if (!isBroadcasting.current) {
          clearInterval(interval);
        } else await recorder.current.start();
      }, recordLength);
    }
  };

  const broadcastingBeep = () => {
    const interval = setInterval(async () => {
      if (!isBroadcasting.current) {
        socket.emit("stream", {
          audioChunks: 0,
          frequency: workingFreq,
          beep: false,
        });
        clearInterval(interval);
      } else
        socket.emit("stream", {
          audioChunks: 0,
          frequency: workingFreq,
          beep: true,
        });
    }, beepLength);
  };

  const recordAudio = (data) => {
    return new Promise((resolve) => {
      navigator.mediaDevices.getUserMedia =
        navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia ||
        navigator.mediaDevices.mozGetUserMedia ||
        navigator.mediaDevices.msGetUserMedia;

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.addEventListener("dataavailable", (event) => {
          socket.emit(data, {
            audioChunks: event.data,
            frequency: workingFreq,
            beep: false,
          });
        });

        const start = () => {
          mediaRecorder.start();
        };

        const stop = () => {
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
        };

        resolve({ start, stop });
      });
    });
  };

  const stopPropagation = (e) => e.stopPropagation();

  const p159PowerHandler = () => {
    setPower(power === PowerType.off ? PowerType.on : PowerType.off);
  };

  let component = null;
  switch (route) {
    case RoutesType.P159:
      component = (
        <div className="wrapper" ref={wrapperRef}>
          <div className="station">
            <div className="spinners_list">
              {spinnersControllsArray.map((control, index) => (
                <Spinner
                  key={index}
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
            <TranseferTypeSwitch selected={transferType} />
            <div className="buttons">
              <Button
                onTouchStart={stationBroadcastHandler}
                onTouchEnd={isNotBroadcasting}
                onMouseDown={stationBroadcastHandler}
                onMouseUp={isNotBroadcasting}
              />
              <Button
                onTouchStart={freqSettingStartedHandler}
                onTouchEnd={freqSettingEndedHandler}
                onMouseDown={freqSettingStartedHandler}
                onMouseUp={freqSettingEndedHandler}
              />
            </div>
            <PowerMetr />
            <Switch
              onClick={p159PowerHandler}
              isOn={power === PowerType.on}
              imgClassName="turned-switch"
            />
            <Micro />
            <Antenna />
            <TlgKlemmKey
              wrapperRef={wrapperRef}
              onTouchStart={isBroadcastingBeep}
              onTouchEnd={isNotBroadcastingBeep}
              onMouseDown={isBroadcastingBeep}
              onMouseUp={isNotBroadcastingBeep}
              onClick={stopPropagation}
            />
            <audio src={"/beep.mp3"} ref={beep} />
          </div>
        </div>
      );
      break;

    case RoutesType.TA57:
      component = (
        <TA57
          onTouchStart={ta57BroadcastHandler}
          onTouchEnd={isNotBroadcasting}
          onMouseDown={ta57BroadcastHandler}
          onMouseUp={isNotBroadcasting}
        />
      );
      break;

    case RoutesType.UNCH:
      component = <UNCH />;
      break;

    default:
      component = null;
      break;
  }

  return (
    <TransferTypeContext.Provider value={{ transferType, setTransferType }}>
      <PowerContext.Provider value={{ power, setPower }}>
        <MicroContext.Provider value={{ micro, setMicro }}>
          <AntennaContext.Provider value={{ antenna, setAntenna }}>
            <TlgKeyContext.Provider value={{ tlgKey, setTlgKey }}>
              <IsTransferingContext.Provider
                value={{ isTransfering, setIsTransfering }}
              >
                <IsTA57ConnectedContext.Provider
                  value={{ isTa57Connected, setTa57Connected }}
                >
                  <ModalSettingsContext.Provider
                    value={{ modalSettings, setModalSettings }}
                  >
                    <RoutesContext.Provider value={{ route, setRoute }}>
                      <IsUNCHConnectedContext.Provider
                        value={{ isUNCHConnected, setIsUNCHConnected }}
                      >
                        <UnchSettingsContext.Provider
                          value={{ unchSettings, setUnchSettings }}
                        >
                          {component}
                          {isTa57Connected && (
                            <button
                              className="switch-ta-57-view-button"
                              onClick={() =>
                                setRoute(
                                  route !== RoutesType.TA57
                                    ? RoutesType.TA57
                                    : RoutesType.P159
                                )
                              }
                            >
                              {route !== RoutesType.TA57
                                ? "Перейти к ТА-57"
                                : "Перейти к Р-159"}
                            </button>
                          )}
                          {isUNCHConnected && (
                            <button
                              className="switch-unhc-view-button"
                              onClick={() =>
                                setRoute(
                                  route !== RoutesType.UNCH
                                    ? RoutesType.UNCH
                                    : RoutesType.P159
                                )
                              }
                            >
                              {route !== RoutesType.UNCH
                                ? "Перейти к УНЧ"
                                : "Перейти к Р-159"}
                            </button>
                          )}
                          <Modal />
                        </UnchSettingsContext.Provider>
                      </IsUNCHConnectedContext.Provider>
                    </RoutesContext.Provider>
                  </ModalSettingsContext.Provider>
                </IsTA57ConnectedContext.Provider>
              </IsTransferingContext.Provider>
            </TlgKeyContext.Provider>
          </AntennaContext.Provider>
        </MicroContext.Provider>
      </PowerContext.Provider>
    </TransferTypeContext.Provider>
  );
}

export default App;
