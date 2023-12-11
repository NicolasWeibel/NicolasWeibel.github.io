console.log(location.search); // lee los argumentos pasados a este formulario

const params = new URLSearchParams(location.search);
var id = parseInt(params.get("id"));

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

const validarFormulario = (personas, stock) => {
  let error = false;

  const $personas = document.getElementById("personas");

  const $validarPersonas = document.getElementById("validar-personas");

  $validarPersonas.textContent = "";

  console.log(stock);

  if (!personas && personas !== 0) {
    $validarPersonas.textContent = "Inserte un valor.";
    $personas.focus();
    error = true;
  } else if (personas <= 0) {
    $validarPersonas.textContent = `Inserte un valor positivo.`;
    $personas.focus();
    error = true;
  } else if (!Number.isInteger(personas)) {
    $validarPersonas.textContent = `Inserte un valor entero.`;
    $personas.focus();
    error = true;
  } else if (personas > stock) {
    $validarPersonas.textContent = `El máximo de personas para este paquete es ${stock}`;
    $personas.focus();
    error = true;
  }

  return !error;
};

const { createApp } = Vue;
createApp({
  data() {
    return {
      paquete: {},
      // url: "http://localhost:5000/paquetes/" + id,
      // si el backend esta corriendo local  usar localhost 5000(si no lo subieron a pythonanywhere)
      url: "https://nico0401.pythonanywhere.com/paquetes/" + id, // si ya lo subieron a pythonanywhere
      error: false,
      cargando: true,
      /*atributos para el guardar los valores del formulario */
      personas: 1,
    };
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.paquete = data;

          const opciones = {
            timeZone: "Europe/London",
            weekday: "short",
            day: "numeric",
            month: "short",
          };

          this.paquete.format_fecha_salida = convertirFormatoFecha(
            new Date(this.paquete.fecha_salida).toLocaleDateString(
              "es-AR",
              opciones
            )
          );
          this.paquete.format_fecha_regreso = convertirFormatoFecha(
            new Date(this.paquete.fecha_regreso).toLocaleDateString(
              "es-AR",
              opciones
            )
          );
          this.paquete.format_precio = new Intl.NumberFormat("es-ES").format(
            this.paquete.precio
          );

          this.cargando = false;
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
        });
    },
    solicitar() {
      if (validarFormulario(this.personas, this.paquete.stock)) {
        let paquete = {
          titulo: this.paquete.titulo,
          descripcion: this.paquete.descripcion,
          fecha_salida: this.paquete.fecha_salida,
          fecha_regreso: this.paquete.fecha_regreso,
          dias: this.paquete.dias,
          noches: this.paquete.noches,
          lugar_partida: this.paquete.lugar_partida,
          destinos: this.paquete.destinos,
          excursiones: this.paquete.excursiones,
          seguro: this.paquete.seguro,
          traslado: this.paquete.traslado,
          alquiler_auto: this.paquete.alquiler_auto,
          precio: this.paquete.precio,
          stock: this.paquete.stock - this.personas,
          imagen: this.paquete.imagen,
        };
        var options = {
          body: JSON.stringify(paquete),
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          redirect: "follow",
        };
        fetch(this.url, options)
          .then(function () {
            alert("¡Solicitud realizada con éxito! Se redujo el stock.");
            location.reload();
          })
          .catch((err) => {
            console.error(err);
            alert("Error al realizar la solicitud");
          });
      }
    },
  },
  created() {
    this.fetchData(this.url);
  },
}).mount("#app");
