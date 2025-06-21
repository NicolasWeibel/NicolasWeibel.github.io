const actualMonth = "6";

document.addEventListener("DOMContentLoaded", () => {
  const monthSelector = document.getElementById("month-select-id");

  // Obtener parámetro de URL (ej: ?month=3)
  const urlParams = new URLSearchParams(window.location.search);
  const selectedMonth = urlParams.get("month") || actualMonth; // Por defecto mes actual

  // Establecer la opción seleccionada en el <select>
  const optionToSelect = [...monthSelector.options].find(
    (opt) => opt.value === selectedMonth
  );
  if (optionToSelect) {
    optionToSelect.selected = true;
  }

  // Cargar dinámicamente el script del mes correspondiente
  const monthScript = document.createElement("script");
  monthScript.src = `js/months/month${selectedMonth}.js`;
  monthScript.defer = true;
  document.body.appendChild(monthScript);

  // Cuando cambia el selector, actualiza la URL con el nuevo mes
  monthSelector.addEventListener("change", () => {
    const newMonth = monthSelector.value;
    const newUrl =
      newMonth != actualMonth
        ? `${window.location.pathname}?month=${newMonth}`
        : window.location.pathname;
    window.location.href = newUrl;
  });
});
