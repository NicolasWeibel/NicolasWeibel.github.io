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

const { createApp } = Vue;
createApp({
  data() {
    return {
      paquetes: [],
      // url: "http://localhost:5000/paquetes",
      // si el backend esta corriendo local  usar localhost 5000(si no lo subieron a pythonanywhere)
      url: "https://nico0401.pythonanywhere.com/paquetes", // si ya lo subieron a pythonanywhere
      error: false,
      cargando: true,
    };
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.paquetes = data;

          const opciones = {
            timeZone: "Europe/London",
            weekday: "short",
            day: "numeric",
            month: "short",
          };

          for (const paquete of this.paquetes) {
            paquete.fecha_salida = convertirFormatoFecha(
              new Date(paquete.fecha_salida).toLocaleDateString(
                "es-AR",
                opciones
              )
            );
            paquete.fecha_regreso = convertirFormatoFecha(
              new Date(paquete.fecha_regreso).toLocaleDateString(
                "es-AR",
                opciones
              )
            );
            paquete.precio = new Intl.NumberFormat("es-ES").format(
              paquete.precio
            );
          }

          this.cargando = false;
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
        });
    },
  },
  created() {
    this.fetchData(this.url);
  },
}).mount("#app");