const spheroLib = require("sphero");
const noble = require("@abandonware/noble");

const video = document.getElementById("webcam");
let sphero = null;

async function setupWebcam() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise(resolve => {
    video.onloadedmetadata = () => resolve(video);
  });
}

function connectSphero() {
  return new Promise((resolve, reject) => {
    noble.on("stateChange", state => {
      if (state === "poweredOn") {
        noble.startScanning([], false);
        console.log("Scanning for Sphero...");
      } else {
        noble.stopScanning();
      }
    });

    noble.on("discover", peripheral => {
      if (peripheral.advertisement.localName && peripheral.advertisement.localName.startsWith("SB-")) {
        noble.stopScanning();
        console.log("Found Sphero:", peripheral.advertisement.localName);
        sphero = spheroLib(peripheral.address);
        sphero.connect(() => {
          console.log("Sphero connected!");
          resolve();
        });
      }
    });
  });
}

async function predictLoop() {
  const prediction = await model.predict(video);
  const topPrediction = prediction[0].className;

  if (!sphero) return;

  if (topPrediction === "Move") {
    sphero.roll(60, 0);
  } else if (topPrediction === "Stop") {
    sphero.stop();
  } else if (topPrediction === "led:red") {
    sphero.color("red");
  }

  requestAnimationFrame(predictLoop);
}

(async () => {
  await setupWebcam();
  await loadModel();
  await connectSphero();
  predictLoop();
})();
