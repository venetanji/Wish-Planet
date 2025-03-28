import { isCompositeComponent } from "react-dom/test-utils";

const EAR_THRESHOLD = 0.27;
const WRIST_THRESHOL = 0.3;

export const appState = {
  WELCOME: Symbol(),
  TUTORIAL: Symbol(),
  GAMING: Symbol(),
  GENERATING: Symbol(),
  CHECKPlANET: Symbol(),
};

export const HAND_STATUS = {
  NO_HAND: Symbol(),
  NOT_PRAYING: Symbol(),
  PRAYING: Symbol(),
};

export const CATCH_STATUS = {
  WAITING: Symbol(),
  CATCHING: Symbol(),
  SUCCESS: Symbol(),
  FAIL: Symbol(),
  END: Symbol(),
};

export const generatingState = {
  BEFORE: Symbol(),
  MIDDLE: Symbol(),
  END: Symbol(),
  SEND: Symbol(),
};

// visualize posenet
export const drawPose = (predictions, canvas) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "14px serif";
  ctx.fillStyle = "white";
  if (predictions.length > 0) {
    let leftEar = predictions[0].pose.leftEar;
    let rightEar = predictions[0].pose.rightEar;
    let leftWrist = predictions[0].pose.leftWrist;
    let rightWrist = predictions[0].pose.rightWrist;
    // ctx.fillText("leftEar", leftEar.x, leftEar.y);
    // ctx.fillText("rightEar", rightEar.x, rightEar.y);
    if (
      leftWrist.confidence > WRIST_THRESHOL &&
      rightWrist.confidence > WRIST_THRESHOL
    ) {
      // ctx.fillText("leftWrist", leftWrist.x, leftWrist.y);
      // ctx.fillText("rightWrist", rightWrist.x, rightWrist.y);
    }
  }
};

export const checkHandStatus = (predictions, canvas) => {
  const ctx = canvas?.getContext("2d");
  if (predictions.length > 0 && !!canvas) {
    let leftEar = predictions[0].pose.leftEar;
    let rightEar = predictions[0].pose.rightEar;
    let leftWrist = predictions[0].pose.leftWrist;
    let rightWrist = predictions[0].pose.rightWrist;

    ctx.font = "30px serif";
    ctx.fillStyle = "white";
    if (
      leftWrist.confidence < WRIST_THRESHOL &&
      rightWrist.confidence < WRIST_THRESHOL
    ) {
      ctx.fillText("not detecting hands", 250, 500);
      return HAND_STATUS.NO_HAND;
    } else if (
      leftEar.x - 50 < leftWrist.x &&
      leftWrist.x < rightWrist.x &&
      rightWrist.x < rightEar.x + 50
    ) {
      ctx.fillText("praying!", 250, 500);
      return HAND_STATUS.PRAYING;
    } else {
      ctx.fillText("not praying", 250, 500);
      return HAND_STATUS.NOT_PRAYING;
    }
  }
};

const eyePoints = [
  "leftEyeLower0",
  "leftEyeLower1",
  "leftEyeLower2",
  "leftEyeLower3",
  "leftEyeUpper0",
  "leftEyeUpper1",
  "leftEyeUpper2",
  "rightEyeLower0",
  "rightEyeLower1",
  "rightEyeLower2",
  "rightEyeLower3",
  "rightEyeUpper0",
  "rightEyeUpper1",
  "rightEyeUpper2",
];

// visualize facemesh
export const drawFace = (predictions, canvas) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.font = "14px serif";
  ctx.fillStyle = "white";
  if (predictions.length > 0) {
    for (let i = 0; i < predictions.length; i += 1) {
      const keypoints = predictions[i].scaledMesh;
      // Draw facial keypoints.
      for (let j = 0; j < keypoints.length; j += 1) {
        const [x, y] = keypoints[j];
        ctx.fillText("·", x * 1.25, y * 1.25);
      }
    }

    predictions.forEach((prediction) => {
      let lowerRight = prediction.annotations.rightEyeUpper0;
      let upperRight = prediction.annotations.rightEyeLower0;
      const rightEAR = getEAR(upperRight, lowerRight);
      let lowerLeft = prediction.annotations.leftEyeUpper0;
      let upperLeft = prediction.annotations.leftEyeLower0;
      const leftEAR = getEAR(upperLeft, lowerLeft);

      let blinked = leftEAR <= EAR_THRESHOLD || rightEAR <= EAR_THRESHOLD;
      if (blinked) {
        console.log("blink");
      }
    });
  }
  ctx.resetTransform();
};
function getEAR(upper, lower) {
  return (
    (getEucledianDistance(upper[5][0], upper[5][1], lower[4][0], lower[4][1]) +
      getEucledianDistance(
        upper[3][0],
        upper[3][1],
        lower[2][0],
        lower[2][1]
      )) /
    (2 *
      getEucledianDistance(upper[0][0], upper[0][1], upper[8][0], upper[8][1]))
  );
}

function getEucledianDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export const isEyePraying = (predictions, canvas) => {};
