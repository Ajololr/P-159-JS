import { io } from "socket.io-client";
const socket = io();
const recordLength = 500;
const beepLength = 100;

const beep = new Audio("../music/beep.mp3");

const userFrequencysOut = new Array(16).fill(0);
const userFrequencysIn = new Array(16).fill(0);
const userModulation = new Array(16).fill(0);
let channel = 0;

const menuRadiostation = {
  statusAntenna: true,
  statusWorking: true,
  blocking: false,
  speakVolume: 10,
  broadcastingOn() {
    this.statusBroadcating = true;
  },

  broadcastingOff() {
    this.statusBroadcating = false;
  },

  beepOn() {
    this.statusBeep = true;
  },

  beepOff() {
    this.statusBeep = false;
  },
};

export function recordAudio(data) {
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
          frequency: userFrequencysOut[channel],
          beep: false,
          speakVolume: menuRadiostation.speakVolume,
          modulation: userModulation[channel],
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
}

export function stopBeep() {
  beep.pause();
  beep.currentTime = 0;
  menuRadiostation.beepOff();
}

socket.on("stream", async (stream) => {
  if (
    !menuRadiostation.statusBroadcating &&
    menuRadiostation.statusWorking &&
    menuRadiostation.statusAntenna
  ) {
    if (
      stream.frequency === userFrequencysIn[channel] &&
      stream.modulation === userModulation[channel]
    )
      try {
        if (stream.beep) {
          if (!menuRadiostation.statusBeep) {
            beep.volume = menuRadiostation.volume / 24;
            beep.play();
            menuRadiostation.beepOn();
          } else {
            if (beep.currentTime > 595) beep.currentTime = 0.142821;
          }
        } else {
          if (menuRadiostation.statusBeep) {
            stopBeep();
          } else {
            const audioBlob = new Blob(Array(stream.audioChunks));
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.volume =
              (stream.speakVolume * menuRadiostation.volume) / (24 * 24);
            await audio.play();
          }
        }
      } catch {}
  }
});

export function getTime(time) {
  let hours = String(Math.floor(time / (60 * 60 * 1000)));
  let minutes = String(Math.floor(time / (60 * 1000)));
  if (hours.length < 2) hours = "0" + hours;
  if (minutes.length < 2) minutes = "0" + minutes;
  return hours + ":" + minutes;
}

let recorder;
let record;

(async () => {
  recorder = await recordAudio("stream");
  record = await recordAudio("record");
})();

export function isBroadcasting() {
  if (
    menuRadiostation.statusAntenna &&
    menuRadiostation.statusWorking &&
    !menuRadiostation.blocking
  ) {
    if (menuRadiostation.statusBeep) stopBeep();
    menuRadiostation.broadcastingOn();
    broadcasting();
  }
}

export function isNotBroadcasting() {
  menuRadiostation.broadcastingOff();
}

menuRadiostation.isBroadcastingBeep = isBroadcastingBeep;
menuRadiostation.isNotBroadcastingBeep = isNotBroadcastingBeep;

export function isBroadcastingBeep() {
  if (
    menuRadiostation.statusAntenna &&
    menuRadiostation.statusWorking &&
    !menuRadiostation.blocking
  ) {
    if (menuRadiostation.statusBeep) stopBeep();
    menuRadiostation.broadcastingOn();
    broadcastingBeep();
  }
}

export function isNotBroadcastingBeep() {
  menuRadiostation.broadcastingOff();
}

export async function broadcasting() {
  if (menuRadiostation.statusBroadcating) {
    recorder.start();
    record.start();

    const interval = setInterval(async () => {
      await recorder.stop();
      if (!menuRadiostation.statusBroadcating) {
        clearInterval(interval);
        await record.stop();
      } else await recorder.start();
    }, recordLength);
  }
}

export function broadcastingBeep() {
  const interval = setInterval(async () => {
    if (!menuRadiostation.statusBroadcating) {
      socket.emit("stream", {
        audioChunks: 0,
        frequency: userFrequencysOut[channel],
        beep: false,
        modulation: userModulation[channel],
      });
      clearInterval(interval);
    } else
      socket.emit("stream", {
        audioChunks: 0,
        frequency: userFrequencysOut[channel],
        beep: true,
        modulation: userModulation[channel],
      });
  }, beepLength);
}
