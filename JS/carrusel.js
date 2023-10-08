document.addEventListener("DOMContentLoaded", function () {
  // Variables
  const IMAGENES = [
    "../img/avion.jpg",
    "../img/ciudad-turistica-mapa.jpg",
    "../img/mujer-mapa.jpg",
    "../img/roca-atardecer.jpg",
    "../img/viaje-pareja.jpg",
  ];
  const TIEMPO_INTERVALO_MILESIMAS_SEG = 3000;
  let posicionActual = 0;
  let $botonRetroceder = document.querySelector("#retroceder");
  let $botonAvanzar = document.querySelector("#avanzar");
  let $carousel = document.querySelector(".carousel");
  let intervalo;

  // Funciones

  // Funcion que precarga imagenes
  const precargaImagenes = () => {
    IMAGENES.forEach((imagenSrc) => {
      const img = new Image();
      img.src = imagenSrc;
    });
  };

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

  // Eventos
  $botonAvanzar.addEventListener("click", pasarFoto);
  $botonRetroceder.addEventListener("click", retrocederFoto);
  // Iniciar
  precargaImagenes();
  renderizarImagen();
  playIntervalo();
});
