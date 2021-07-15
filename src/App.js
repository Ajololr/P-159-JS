import { createContext, useEffect, useRef, useState } from "react";
import { connect } from "socket.io-client";

import "./App.css";

import { Spinner } from "./components/spiner/spiner";
import { Button } from "./components/button/button";
import { TranseferTypeSwitch } from "./components/transeferTypeSwitch/transeferTypeSwitch";
import DistConrolImg from "./assets/images/dist-controll.png";
import PowerMetr from "./components/PowerMetr/PowerMetr";
import PowerSwitch from "./components/PowerSwitch/PowerSwitch";
import Micro from "./components/Micro/Micro";
import Antenna from "./components/Antenna/Antenna";
import Controls from "./components/Controls/Controls";

let socket =
  process.env.NODE_ENV === "production"
    ? connect()
    : connect("https://localhost:2000");
const recordLength = 500;
const beepLength = 100;

const beep = new Audio("./assets/music/beep.mp3");

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
  const prevPower = useRef(power);
  const [micro, setMicro] = useState(false);
  const [antenna, setAntenna] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState("30000");
  const [workingFreq, setWorkingFreq] = useState("30000");

  const isBroadcasting = useRef(false);
  const isBeep = useRef(false);
  const recorder = useRef(null);

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

  useEffect(() => {
    socket.on("stream", async (stream) => {
      if (!isBroadcasting.current && power === PowerType.on && antenna) {
        if (stream.frequency === workingFreq)
          try {
            if (stream.beep) {
              if (!isBeep.current) {
                beep.play();
                isBeep.current = true;
              } else {
                if (beep.currentTime > 595) beep.currentTime = 0.142821;
              }
            } else {
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
    });
  });

  const stopBeep = () => {
    beep.pause();
    beep.currentTime = 0;
    isBeep.current = false;
  };

  const broadcastingHandler = () => {
    if (antenna && micro && power === PowerType.on) {
      // if (isBeep.current) stopBeep();
      isBroadcasting.current = true;
      broadcasting();
    }
  };

  function isNotBroadcasting() {
    isBroadcasting.current = false;
  }

  function isBroadcastingBeep() {
    if (antenna && power === PowerType.on) {
      if (isBeep.current) stopBeep();
      isBroadcasting.current = true;
      broadcastingBeep();
    }
  }

  function isNotBroadcastingBeep() {
    isBroadcasting.current = false;
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
          mediaRecorder.stop();
        };

        resolve({ start, stop });
      });
    });
  };

  return (
    <TransferTypeContext.Provider value={{ transferType, setTransferType }}>
      <PowerContext.Provider value={{ power, setPower }}>
        <MicroContext.Provider value={{ micro, setMicro }}>
          <AntennaContext.Provider value={{ antenna, setAntenna }}>
            <div className="wrapper">
              <Controls
                onTouchStart={isBroadcastingBeep}
                onTouchEnd={isNotBroadcastingBeep}
                onMouseDown={isBroadcastingBeep}
                onMouseUp={isNotBroadcastingBeep}
              />
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
                  <Button
                    onTouchStart={broadcastingHandler}
                    onTouchEnd={isNotBroadcasting}
                    onMouseDown={broadcastingHandler}
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
