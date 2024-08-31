const gameBtn = document.querySelector("#gameBtn");
const menuBtns = document.querySelector("#menuBtns");
const gameModesBtns = document.querySelector("#gameModesBtns");
const backBtn = document.querySelector("#backBtn");
// const changeThemeBnt = document.querySelector("#changeThemeBtn");
const appWrapper = document.querySelector("#app-wrapper");
const menuTile = document.querySelector("#menu-title");
const toggleTheme = document.querySelector("#toggleTheme");

let isToggle = false;

gameBtn.addEventListener("click", () => {
  menuBtns.style.display = "none";
  gameModesBtns.style.display = "flex";
});

backBtn.addEventListener("click", () => {
  menuBtns.style.display = "flex";
  gameModesBtns.style.display = "none";
});

// changeThemeBtn.addEventListener("click", () => {
//   appWrapper.classList = "bg-black h-full";
//   menuTile.classList =
//     "text-white font-bold text-6xl mt-5 text-center select-none";
// });

toggleTheme.addEventListener("click", () => {
  toggleTheme.classList.toggle("active");
  appWrapper.classList.toggle("dark");
  // if (appWrapper.classList.contains("app-wrapper-light")) {
  //   appWrapper.classList.remove("app-wrapper-light");
  //   appWrapper.classList.add("app-wrapper-dark");
  // } else {
  //   appWrapper.classList.remove("app-wrapper-dark");
  //   appWrapper.classList.add("app-wrapper-light");
  // }
});
