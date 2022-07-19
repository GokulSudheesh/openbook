let icon = document.querySelector("#icon");
let links = document.querySelector(".links");
let spans = [
  document.querySelector("#top"),
  document.querySelector("#mid"),
  document.querySelector("#low"),
];

const toggleIcon = () => {
  icon.classList.toggle("active");
  links.classList.toggle("active");
};

const closeMenu = (e) => {
  if (e.target === icon || spans.includes(e.target)) return
  if (
    icon.classList.contains("active") &&
    links.classList.contains("active")
  ) {
    icon.classList.remove("active");
    links.classList.remove("active");
  }
};

icon.addEventListener("click", toggleIcon);
// icon.addEventListener("touchstart", toggleIcon);

//  click anyware outside  menu and toggle button
// document.addEventListener("click", closeMenu);
// document.addEventListener("touchstart", closeMenu);
