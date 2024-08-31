import "./style.css";
import { gsap } from "gsap";
import { Player, Projectile, Enemy, Buff, Particle } from "./scripts/classes";
import { randomIntFromInterval } from "./scripts/utils";

const canvas = document.querySelector("#mainCanvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let x = canvas.width / 2;
let y = canvas.height / 2;

const scoreEl = document.querySelector("#score");
const enemiesDestroyedEl = document.querySelector("#enemiesDestroyed");
const startBtnEl = document.querySelector("#startBtn");
const modalEl = document.querySelector("#modal");
const modalScore = document.querySelector("#modalScore");
const startGameBtn = document.querySelector("#startGameBtn");

///Music elements
const menuMusicPlayer = document.querySelector("#menuMusicPlayer");
const menuMusicMuteBtn = document.querySelector("#menuMusicMuteBtn");
const backgroundGameAudioPlayer = document.querySelector("#audioPlayer");
const bgMusicMutebtn = document.querySelector("#pauseBtn");
const shootSoundPlayer = document.querySelector("#shootSoundPlayer");

const mainGameEl = document.querySelector("#mainGame");
const mainMenuEl = document.querySelector("#mainMenu");
const backToMenuBtn = document.querySelector("#backToMenuBtn");

// /////////bgIMAGE
// let bgImg = new Image();
// bgImg.src = "./public/1.jpg";
// c.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

////Listeners
bgMusicMutebtn.addEventListener("click", () => {
  pauseMusic(backgroundGameAudioPlayer, "bg");
});

backToMenuBtn.addEventListener("click", () => {
  mainGameEl.style.display = "none";
  mainMenuEl.style.display = "flex";
  pausedGameBgMusic = false;
  if (wasEnabled) {
    pauseMusic(menuMusicPlayer, "menu");
  }
  pauseMusic(backgroundGameAudioPlayer, "bg");
});

menuMusicMuteBtn.addEventListener("click", (e) => {
  menuMusicMuteBtn.children[0].classList.toggle("fa-volume-xmark");
  console.log();
  pauseMusic(menuMusicPlayer, "menu");
  wasEnabled = false;
});

startGameBtn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  spawnBuff();
  mainGameEl.style.display = "block";
  mainMenuEl.style.display = "none";
  modalEl.style.display = "none";
  pausedGameBgMusic = false;
  pausedMenuMusic = false;
  pauseMusic(menuMusicPlayer, "menu");
  backgroundGameAudioPlayer.play();
});

let pausedGameBgMusic = false;
let pausedMenuMusic = false;
let wasEnabled = true;

function pauseMusic(player, type) {
  if (type === "bg") {
    if (pausedGameBgMusic) {
      player.play();
      pausedGameBgMusic = false;
    } else {
      player.pause();
      pausedGameBgMusic = true;
    }
  } else {
    if (pausedMenuMusic) {
      player.play();
      pausedMenuMusic = false;
    } else {
      player.pause();
      pausedMenuMusic = true;
    }
  }
}

let projectiles = [];
let enemies = [];
let particles = [];
let buffs = [];
let buffInterval;
let buffed = "";
let shield = true;
const buffTypes = [
  { color: "yellow", type: "chrono" },
  { color: "red", type: "damage" },
  { color: "green", type: "shield" },
  { color: "blue", type: "freeze" },
  { color: "white", type: "bounce" },
];
let player = new Player(x, y, 15, "white");

function init() {
  x = canvas.width / 2;
  y = canvas.height / 2;
  player = new Player(x, y, 15, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  buffs = [];
  score = 0;
  buffed = "";
  shield = false;
  scoreEl.innerHTML = score;
  modalScore.innerHTML = score;
}

function createBuff() {
  let randomNumber = randomIntFromInterval(0, buffTypes.length - 1);
  buffs.push(
    new Buff(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      20,
      20,
      buffTypes[randomNumber].color,
      buffTypes[randomNumber].type
    )
  );
}

function spawnBuff() {
  buffInterval = setInterval(createBuff, 5000);
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    if (buffed !== "freeze") {
      enemies.push(new Enemy(x, y, radius, color, velocity));
    }
  }, 2000);
}

let animationId;
let score = 0;
let enemiesDestroyed = 0;

function animate() {
  animationId = requestAnimationFrame(animate);
  // let bgImg = new Image();
  // bgImg.src = "./public/1.jpg";
  // c.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  c.fillStyle = "rgba(0, 0, 0, 0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  if (shield) {
    player.draw(true);
  } else {
    player.draw(false);
  }

  particles.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) {
      particles.splice(particleIndex, 1);
    } else {
      particle.update();
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update();

    if (buffed === "bounce") {
      if (
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height
      ) {
        projectile.velocity.y = -projectile.velocity.y;
      }
      if (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width
      ) {
        projectile.velocity.x = -projectile.velocity.x;
      }
    } else {
      if (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height
      ) {
        setTimeout(() => {
          projectiles.splice(index, 1);
        }, 0);
      }
    }
  });

  if (buffs.length >= 1) {
    clearInterval(buffInterval);
    spawnBuff();
  }

  buffs.forEach((buff, indexBuff) => {
    buff.update();

    projectiles.forEach((projectile, projIndex) => {
      const distBuff = Math.hypot(projectile.x - buff.x, projectile.y - buff.y);

      if (distBuff - buff.width - projectile.radius < 1) {
        for (let i = 0; i < buff.width * 2; i++) {
          particles.push(
            new Particle(buff.x, buff.y, Math.random() * 2, buff.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            })
          );
        }
        if (buff.type === "shield") {
          shield = true;
        } else {
          buffed = buff.type;
        }
        setTimeout(() => {
          buffed = "";
        }, 5000);
        buffs.splice(indexBuff, 1);
        projectiles.splice(projIndex, 1);
      }
    });
  });

  enemies.forEach((enemy, index) => {
    switch (buffed) {
      case "freeze":
        enemy.update(0);
        break;
      case "chrono":
        enemy.update(0.5);
        break;
      default:
        enemy.update();
    }

    const distPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (distPlayer - enemy.radius - player.radius < 1) {
      if (shield) {
        enemies.splice(index, 1);
        player = new Player(x, y, 15, "white");
        shield = false;
      } else {
        cancelAnimationFrame(animationId);
        modalEl.style.display = "flex";
        modalScore.innerHTML = score;
      }
    }

    projectiles.forEach((projectile, projIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (dist - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6),
            })
          );
        }
        for (let i = 0; i < projectile.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              projectile.color,
              {
                x: -(Math.random() - 0.5) * (Math.random() * 6),
                y: -(Math.random() - 0.5) * (Math.random() * 6),
              }
            )
          );
        }
        if (buffed === "damage") {
          score += 250;
          enemiesDestroyed += 1;

          scoreEl.innerHTML = score;
          enemiesDestroyedEl.innerHTML = enemiesDestroyed;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projIndex, 1);
          }, 0);
        } else {
          if (enemy.radius - 10 > 5) {
            score += 100;
            scoreEl.innerHTML = score;

            gsap.to(enemy, {
              radius: enemy.radius - 10,
            });
            setTimeout(() => {
              projectiles.splice(projIndex, 1);
            }, 0);
          } else {
            score += 250;
            enemiesDestroyed += 1;

            scoreEl.innerHTML = score;
            enemiesDestroyedEl.innerHTML = enemiesDestroyed;
            setTimeout(() => {
              enemies.splice(index, 1);
              projectiles.splice(projIndex, 1);
            }, 0);
          }
        }
      }
    });
  });
}

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

window.addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - y, event.clientX - x);
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  };
  if (event.target.tagName !== "BUTTON") {
    // shootSoundPlayer.play();

    projectiles.push(
      new Projectile(x, y, 5, buffed === "damage" ? "red" : "white", velocity)
    );
  }
});

startBtnEl.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  spawnBuff();
  modalEl.style.display = "none";
});
