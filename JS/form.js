const eliminarAdyacente = (elementos) => {
  for (elemento of elementos) {
    if (elemento.nextSibling.tagName) {
      elemento.nextSibling.remove();
    }
  }
};

const limpiarCampos = (elementos) => {
  for (elemento of elementos) {
    elemento.value = "";
  }
};

const insertarMensajeError = (elementoObjectivo, mensaje) => {
  const errorSpan = document.createElement("span");
  errorSpan.classList.add("error");
  errorSpan.textContent = mensaje;
  elementoObjectivo.insertAdjacentElement("afterend", errorSpan);
};

const enviarFormulario = (_elementos) => {
  const $envioExitoso = document.querySelector(".envio-exitoso");
  $envioExitoso.classList.add("active");
  setTimeout(function () {
    $envioExitoso.classList.remove("active");
  }, 3000);
};

const validarFormulario = (e) => {
  e.preventDefault();
  let error = false;

  const $nombre = document.getElementById("nombre");
  const $email = document.getElementById("email");
  const $telefono = document.getElementById("telefono");
  const $asunto = document.getElementById("asunto");
  const $mensaje = document.getElementById("mensaje");
  const elementos = [$nombre, $email, $telefono, $asunto, $mensaje];

  const regexTel = /^[0-9\-()+]*$/; // Expresión regular de números de teléfono
  const regexEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  eliminarAdyacente(elementos);

  if (!$nombre.value) {
    insertarMensajeError($nombre, "Inserte un valor.");
    error = true;
  } else if ($nombre.value.length > 50) {
    insertarMensajeError(
      $nombre,
      "El nombre debe contener un máximo de 50 caracteres."
    );
    error = true;
  }

  if (!$email.value) {
    insertarMensajeError($email, "Inserte un valor.");
    error = true;
  } else if (!regexEmail.test($email.value)) {
    insertarMensajeError($email, "Inserte un email válido.");
    error = true;
  }

  if ($telefono.value.length > 20 || !regexTel.test($telefono.value)) {
    insertarMensajeError($telefono, "Inserte un número telefónico válido.");
    error = true;
  }

  if (!$asunto.value) {
    insertarMensajeError($asunto, "Inserte un valor.");
    error = true;
  } else if ($asunto.value.length > 100) {
    insertarMensajeError(
      $asunto,
      "El asunto debe contener un máximo de 100 caracteres."
    );
    error = true;
  }

  if (!$mensaje.value) {
    insertarMensajeError($mensaje, "Inserte un valor.");
    error = true;
  } else if ($mensaje.value.length > 500) {
    insertarMensajeError(
      $mensaje,
      "El mensaje debe contener un máximo de 500 caracteres."
    );
    error = true;
  }

  if (!error) {
    limpiarCampos(elementos);
    enviarFormulario(elementos);
  }
};
