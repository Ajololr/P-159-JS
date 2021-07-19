import { createContext, useEffect, useRef, useState } from "react";
import { connect } from "socket.io-client";

import "./App.css";

import { Spinner } from "./components/spiner/spiner";
import { Button } from "./components/button/button";
import { TranseferTypeSwitch } from "./components/transeferTypeSwitch/transeferTypeSwitch";
import PowerMetr from "./components/PowerMetr/PowerMetr";
import PowerSwitch from "./components/PowerSwitch/PowerSwitch";
import Micro from "./components/Micro/Micro";
import Antenna from "./components/Antenna/Antenna";
import TlgKlemmKey from "./components/TlgKlemmKey/TlgKlemmKey";
import TA57 from "./components/TA57/TA57";

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

export const IsTAVisibleContext = createContext();

function App() {
  const [transferType, setTransferType] = useState(TransferType.tlf);
  const [power, setPower] = useState(PowerType.off);
  const prevPower = useRef(power);
  const [micro, setMicro] = useState(false);
  const [antenna, setAntenna] = useState(false);
  const [tlgKey, setTlgKey] = useState(false);
  const [isTaVisible, setIsTaVisible] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState("30000");
  const [workingFreq, setWorkingFreq] = useState(Math.random());
  const [isTransfering, setIsTransfering] = useState(false);

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
              transferType === TransferType.du)
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
    if (
      antenna &&
      micro &&
      power === PowerType.on &&
      (transferType === TransferType.tlf ||
        transferType === TransferType.tlfPh ||
        transferType === TransferType.du)
    ) {
      if (isBeep.current) stopBeep();
      isBroadcasting.current = true;
      setIsTransfering(true);
      broadcasting();
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

  return (
    <TransferTypeContext.Provider value={{ transferType, setTransferType }}>
      <PowerContext.Provider value={{ power, setPower }}>
        <MicroContext.Provider value={{ micro, setMicro }}>
          <AntennaContext.Provider value={{ antenna, setAntenna }}>
            <TlgKeyContext.Provider value={{ tlgKey, setTlgKey }}>
              <IsTransferingContext.Provider
                value={{ isTransfering, setIsTransfering }}
              >
                <IsTAVisibleContext.Provider
                  value={{ isTaVisible, setIsTaVisible }}
                >
                  {transferType === TransferType.du && (
                    <button
                      className="switch-ta-57-view-button"
                      onClick={() => setIsTaVisible(!isTaVisible)}
                    >
                      {isTaVisible ? "К Р-159" : "К ТА-57"}
                    </button>
                  )}
                  {isTaVisible ? (
                    <TA57
                      onTouchStart={broadcastingHandler}
                      onTouchEnd={isNotBroadcasting}
                      onMouseDown={broadcastingHandler}
                      onMouseUp={isNotBroadcasting}
                    />
                  ) : (
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
                  )}{" "}
                </IsTAVisibleContext.Provider>
              </IsTransferingContext.Provider>
            </TlgKeyContext.Provider>
          </AntennaContext.Provider>
        </MicroContext.Provider>
      </PowerContext.Provider>
    </TransferTypeContext.Provider>
  );
}

export default App;
