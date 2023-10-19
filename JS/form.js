const limpiarCampos = (elementos) => {
  for (elemento of elementos) {
    elemento.value = "";
  }
};

const limpiarValidadores = (elementos) => {
  for (elemento of elementos) {
    elemento.textContent = "";
  }
};

const enviarFormulario = (_elementos) => {
  const $envioExitoso = document.querySelector(".envio-exitoso");
  $envioExitoso.classList.add("active");
  setTimeout(function () {
    $envioExitoso.classList.remove("active");
  }, 3000);
};

const validarFormulario = () => {
  let error = false;

  const $nombre = document.getElementById("nombre");
  const $email = document.getElementById("email");
  const $telefono = document.getElementById("telefono");
  const $asunto = document.getElementById("asunto");
  const $mensaje = document.getElementById("mensaje");

  const $validarNombre = document.getElementById("validar-nombre");
  const $validarEmail = document.getElementById("validar-email");
  const $validarTelefono = document.getElementById("validar-telefono");
  const $validarAsunto = document.getElementById("validar-asunto");
  const $validarMensaje = document.getElementById("validar-mensaje");

  limpiarValidadores([
    $validarNombre,
    $validarEmail,
    $validarTelefono,
    $validarAsunto,
    $validarMensaje,
  ]);

  const regexTel = /^[0-9\-()+]*$/; // Expresión regular de números de teléfono
  const regexEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/; // Expresión regular de números de correos electrónicos

  if (!$mensaje.value) {
    $validarMensaje.textContent = "Inserte un valor.";
    $mensaje.focus();
    error = true;
  } else if ($mensaje.value.length > 500) {
    $validarMensaje.textContent =
      "El mensaje debe contener un máximo de 500 caracteres.";
    $mensaje.focus();
    error = true;
  }

  if (!$asunto.value) {
    $validarAsunto.textContent = "Inserte un valor.";
    $asunto.focus();
    error = true;
  } else if ($asunto.value.length > 100) {
    $validarAsunto.textContent =
      "El asunto debe contener un máximo de 100 caracteres.";
    $asunto.focus();
    error = true;
  }

  if ($telefono.value.length > 20 || !regexTel.test($telefono.value)) {
    $validarTelefono.textContent = "Inserte un número telefónico válido.";
    $telefono.focus();
    error = true;
  }

  if (!$email.value) {
    $validarEmail.textContent = "Inserte un valor.";
    $email.focus();
    error = true;
  } else if (!regexEmail.test($email.value)) {
    $validarEmail.textContent = "Inserte un email válido.";
    $email.focus();
    error = true;
  }

  if (!$nombre.value) {
    $validarNombre.textContent = "Inserte un valor.";
    $nombre.focus();
    error = true;
  } else if ($nombre.value.length > 50) {
    $validarNombre.textContent =
      "El nombre debe contener un máximo de 50 caracteres.";
    $nombre.focus();
    error = true;
  }

  if (!error) {
    const elementos = [$nombre, $email, $telefono, $asunto, $mensaje];
    limpiarCampos(elementos);
    enviarFormulario(elementos);
  }
  return false;
};
