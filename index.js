const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
console.log(ctx);

canvas.width = 1240;
canvas.height = 576;
const gravity = 1.5;
let rightOffset = 0;

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

const platformImg = createImage("http://127.0.0.1:5500/images/platform.png");
const platformTallImg = createImage(
  "http://127.0.0.1:5500/images/platformSmallTall.png"
);
class GenericObjects {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width,
      this.image.height
    );
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.image.width,
      this.image.height
    );
  }
}
class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.speed = 10;
    this.width = 20;
    this.height = 20;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    genericObjects.forEach((genericObject) => {
      genericObject.draw();
    });
    platforms.forEach((platform) => {
      platform.draw();
    });
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

let player;
let platforms = [];
let genericObjects = [];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

function init() {
  rightOffset = 0;
  player = new Player();
  platforms = [
    new Platform({
      x: platformImg.width * 4 - platformTallImg.width + 300,
      y: 370,
      image: platformTallImg,
    }),
    new Platform({ x: -1, y: 470, image: platformImg }),
    new Platform({ x: platformImg.width - 3, y: 470, image: platformImg }),
    new Platform({
      x: platformImg.width * 2 + 100,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 3 + 300,
      y: 470,
      image: platformImg,
    }),
    new Platform({ x: platformImg.width * 5, y: 470, image: platformImg }),
    new Platform({ x: platformImg.width * 6 - 2, y: 470, image: platformImg }),
  ];
  genericObjects = [
    new GenericObjects({
      x: -1,
      y: -1,
      image: createImage("http://127.0.0.1:5500/images/background.png"),
    }),
    new GenericObjects({
      x: 0,
      y: 0,
      image: createImage("http://127.0.0.1:5500/images/hills.png"),
    }),
  ];
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && rightOffset === 0 && player.position.x > 0)) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    genericObjects.forEach((genericObject) => {
      if (keys.right.pressed) {
        genericObject.position.x -= player.speed * 0.44;
      } else if (keys.left.pressed && rightOffset > 0) {
        genericObject.position.x += player.speed * 0.44;
      }
    });
    if (keys.right.pressed) {
      rightOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
    } else if (keys.left.pressed && rightOffset > 0) {
      rightOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
    }
  }

  // Platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  if (rightOffset > platformImg.width * 6) {
    console.log("You win!");
  }
  if (player.position.y > canvas.height) {
    console.log("You lose");
    init();
  }
}
init();
animate();

window.addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = true;
      break;
    case 68:
      console.log("right");
      keys.right.pressed = true;
      break;
    case 87:
      console.log("top");
      player.velocity.y -= 18;
      break;
    case 83:
      console.log("down");
      break;
  }
});

window.addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 68:
      console.log("right");
      keys.right.pressed = false;
      break;
    case 87:
      console.log("top");
      break;
    case 83:
      console.log("down");
      break;
  }
});
