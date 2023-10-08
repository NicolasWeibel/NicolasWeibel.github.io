// Selecciona el elemento del encabezado
const $header = document.querySelector("header");

// Función para manejar el evento de scroll
function manejarScroll() {
  if (window.scrollY > 0) {
    $header.classList.add("header-sombra");
  } else {
    $header.classList.remove("header-sombra");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", manejarScroll);
});
