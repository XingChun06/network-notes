const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-nav]");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
    menuButton.textContent = isOpen ? "×" : "☰";
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "打开导航");
      menuButton.textContent = "☰";
    }
  });
}

const year = document.querySelector("[data-year]");
if (year) {
  year.textContent = String(new Date().getFullYear());
}
