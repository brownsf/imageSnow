const video = document.querySelector("video");
const canvas = (window.canvas = document.querySelector("canvas"));
canvas.width = 480;
canvas.height = 360;
const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";
ctx.fillRect(0, 0, canvas.width, canvas.height);
let pixels = [];

class Pixel {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.speed = Math.random() * 2 + 0.01;
    this.size = Math.random() * 0.5 + 1;
  }

  update(imageInfo) {
    const pos1 = Math.floor(this.y);
    const pos2 = Math.floor(this.x);
    console.log({ pos1, pos2 });
    this.speed = imageInfo[pos1][pos2].brightness;
    this.y += this.speed;
    console.log(this.speed);
    if (this.y > canvas.height) {
      this.y = 0;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function invertColors(data) {
  for (var i = 0; i < data.length; i += 4) {
    data[i] = data[i] ^ 255; // Invert Red
    data[i + 1] = data[i + 1] ^ 255; // Invert Green
    data[i + 2] = data[i + 2] ^ 255; // Invert Blue
  }
}
function draw() {
  video.style = "display:none";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  invertColors(imageData.data);

  // Update the canvas with the new data
  //ctx.putImageData(imageData, 0, 0);

  let mappedImage = [];
  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      const red = imageData.data[y * 4 * canvas.width + y * 4];
      const green = imageData.data[y * 4 * canvas.width + (y * 4 + 1)];
      const blue = imageData.data[y * 4 * canvas.width + (y * 4 + 2)];
      const brightness = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      row.push({ brightness, red, green, blue });
    }
    mappedImage.push(row);
  }

  ctx.fillStyle = "rgb(0, 0, 0)";
  pixels.forEach((pix) => {
    pix.update(mappedImage);
    pix.draw();
  });

  requestAnimationFrame(draw);
}

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  for (let i = 0; i < 2500; i++) {
    pixels.push(new Pixel());
  }
  console.log("here", pixels);
  draw();
}

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(handleSuccess)
  .catch(handleError);
