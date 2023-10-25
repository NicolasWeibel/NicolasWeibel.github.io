const convertirFormatoFecha = (fechaString) => {
  // Divide la cadena original en componentes capitalizados (día de la semana, día y mes)
  const componentes = fechaString.split(" ");

  if (componentes.length === 3) {
    const diaSemana =
      componentes[0][0].toUpperCase() +
      componentes[0].slice(1).replace(",", "");
    const numeroDia = componentes[1];
    const mes = componentes[2][0].toUpperCase() + componentes[2].slice(1);

    return `${diaSemana} ${numeroDia} ${mes}`;
  }

  // Si el formato de entrada es incorrecto, devuelve la cadena original
  return fechaString;
};

const crearPaquete = (
  titulo,
  rutaImg,
  dias,
  noches,
  fechaIda,
  fechaVuelta,
  destinos,
  lugarSalida,
  precio
) => {
  // Crear paquete
  const $paquete = document.createElement("div");
  $paquete.className = "paquete";

  // Crear imagen
  const $img = document.createElement("img");
  $img.src = rutaImg;
  $img.alt = titulo;
  $paquete.appendChild($img);

  // Crear contenedor texto
  const $contenedorTexto = document.createElement("div");
  $contenedorTexto.className = "contenedor-paquete-texto";
  $paquete.appendChild($contenedorTexto);

  // Crear Div Dias y Noches
  const $diaNoche = document.createElement("div");
  $diaNoche.className = "paquete-dias-noches";
  $diaNoche.textContent = `${dias} Días / ${noches} Noches`;
  $contenedorTexto.appendChild($diaNoche);

  // Crear Div Titulo
  const $titulo = document.createElement("div");
  $titulo.className = "paquete-titulo";
  const $tituloH3 = document.createElement("h3");
  $tituloH3.textContent = titulo;
  $titulo.appendChild($tituloH3);
  $contenedorTexto.appendChild($titulo);

  // Crear Div Fecha
  const opciones = { weekday: "short", day: "numeric", month: "short" };
  let formFechaIda = convertirFormatoFecha(
    new Date(fechaIda).toLocaleString("es-ES", opciones)
  );
  let formFechaVuelta = convertirFormatoFecha(
    new Date(fechaVuelta).toLocaleString("es-ES", opciones)
  );

  const $fecha = document.createElement("div");
  $fecha.className = "paquete-fecha";
  const $ida = document.createElement("em");
  $ida.textContent = formFechaIda;
  const $vuelta = document.createElement("em");
  $vuelta.textContent = formFechaVuelta;
  $fecha.appendChild(document.createTextNode("Desde "));
  $fecha.appendChild($ida);
  $fecha.appendChild(document.createTextNode(" Hasta "));
  $fecha.appendChild($vuelta);
  $contenedorTexto.appendChild($fecha);

  // Crear Div Destinos
  let lugaresDestino = "";
  for (let ind in destinos) {
    if (ind != destinos.length - 1) {
      lugaresDestino += `${destinos[ind]} - `;
    } else {
      lugaresDestino += destinos[ind];
    }
  }
  const $destinos = document.createElement("div");
  $destinos.className = "paquete-destinos";
  const $emDestinos = document.createElement("em");
  $emDestinos.textContent = "Destinos: ";
  const $spanDestinos = document.createElement("span");
  $spanDestinos.textContent = lugaresDestino;
  $destinos.appendChild($emDestinos);
  $destinos.appendChild($spanDestinos);
  $contenedorTexto.appendChild($destinos);

  // Crear Div Salida
  const $salida = document.createElement("div");
  $salida.className = "paquete-salida";
  const $emSalida = document.createElement("em");
  $emSalida.textContent = "Saliendo desde: ";
  const $spanSalida = document.createElement("span");
  $spanSalida.textContent = lugarSalida;
  $salida.appendChild($emSalida);
  $salida.appendChild($spanSalida);
  $contenedorTexto.appendChild($salida);

  // Crear Div Paquete Precio
  const $paquetePrecio = document.createElement("div");
  $paquetePrecio.className = "paquete-precio";
  $paquete.appendChild($paquetePrecio);

  // Crear Div Precio Leyenda
  const $precioLeyenda = document.createElement("div");
  $precioLeyenda.className = "precio-leyenda";
  $precioLeyenda.textContent = "Precio por persona";
  $paquetePrecio.appendChild($precioLeyenda);

  // Crear Div Precio
  const formPrecio = new Intl.NumberFormat("es-ES").format(precio);
  const $precio = document.createElement("div");
  $precio.className = "precio";
  const $simbolo = document.createElement("span");
  $simbolo.className = "simbolo";
  $simbolo.textContent = "$ ";
  const $cantidad = document.createElement("span");
  $cantidad.className = "cantidad";
  $cantidad.textContent = formPrecio;
  $precio.appendChild($simbolo);
  $precio.appendChild($cantidad);
  $paquetePrecio.appendChild($precio);

  // Crear Div Precio Detalle
  const $precioDetalle = document.createElement("div");
  $precioDetalle.className = "precio-detalle";
  $precioDetalle.textContent = "Incl. imp. PAIS + AFIP";
  $paquetePrecio.appendChild($precioDetalle);

  return $paquete;
};

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://mocki.io/v1/dce18af0-ff1a-4800-9115-f16c04506f60")
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      const $contenedorPaquetes = document.querySelector(
        ".contenedor-paquetes"
      );
      for (let paquete of json["packages"]) {
        let $divPaquete = crearPaquete(
          paquete.title,
          paquete.img,
          paquete.days,
          paquete.nights,
          paquete.departure_date,
          paquete.return_date,
          paquete.destinations,
          paquete.departure_place,
          paquete.price
        );
        $contenedorPaquetes.appendChild($divPaquete);
      }
    });
});
