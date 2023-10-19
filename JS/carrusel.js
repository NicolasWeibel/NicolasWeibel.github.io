// Variables
const IMAGENES = [
  "../img/avion.webp",
  "../img/ciudad-turistica-mapa.webp",
  "../img/mujer-mapa.webp",
  "../img/roca-atardecer.webp",
  "../img/viaje-pareja.webp",
];
const TIEMPO_INTERVALO_MILESIMAS_SEG = 3000;
let posicionActual = 0;
let $botonRetroceder = document.querySelector("#retroceder");
let $botonAvanzar = document.querySelector("#avanzar");
let $carousel = document.querySelector(".carousel");
let intervalo;

// Funciones

// Funcion que cambia la foto en la siguiente posicion
function pasarFoto() {
  if (posicionActual >= IMAGENES.length - 1) {
    posicionActual = 0;
  } else {
    posicionActual++;
  }
  renderizarImagen();
  playIntervalo();
}

// Funcion que cambia la foto en la anterior posicion
function retrocederFoto() {
  if (posicionActual <= 0) {
    posicionActual = IMAGENES.length - 1;
  } else {
    posicionActual--;
  }
  renderizarImagen();
  playIntervalo();
}

// Funcion que actualiza la imagen dependiendo de posicionActual
function renderizarImagen() {
  $carousel.style.backgroundImage = `url(${IMAGENES[posicionActual]})`;
}

// Activa el autoplay de la imagen
function playIntervalo() {
  clearInterval(intervalo);
  intervalo = setInterval(pasarFoto, TIEMPO_INTERVALO_MILESIMAS_SEG);
}

// Funcion que precarga imagenes
const precargaImagenes = (iniciarCarrusel) => {
  let imagenesCargadas = 0;
  IMAGENES.forEach((url) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      imagenesCargadas++;
      if (imagenesCargadas === 2) {
        iniciarCarrusel();
      }
    };
  });
};

// Funcion que inicia carrusel
const iniciarCarrusel = () => {
  renderizarImagen();
  playIntervalo();
};

document.addEventListener("DOMContentLoaded", function () {
  // Eventos
  $botonAvanzar.addEventListener("click", pasarFoto);
  $botonRetroceder.addEventListener("click", retrocederFoto);
  // Iniciar
  precargaImagenes(iniciarCarrusel);
});
