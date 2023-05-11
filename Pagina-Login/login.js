'use strict';

let users;
const loginForm = document.querySelector('#login-form');

const displayLoginMessage = (msgType, msgInfo, isErrorMsg) => {
  let elementHTML;
  if (isErrorMsg) {
    elementHTML = `
    <div class="login-error-container login-message-container">
      <p class="error-type msg-type">${msgType}</p>
      <p class="error-info msg-info">${msgInfo}</p>
    </div>`;
  } else {
    elementHTML = `
    <div class="logged-in-container login-message-container">
      <p class="logged-info msg-info">${msgInfo}</p>
    </div>`;
  };

  const elementExists = document.querySelector('#login-form .login-message-container');
  if (elementExists) {
    elementExists.remove();
  };

  const h1Element = document.querySelector("#login-form h1");
  h1Element.insertAdjacentHTML("afterend", elementHTML);
};

const createLoginCookie = (username, token, daysToExpire) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  const cookieValue = `username=${username}!${token}; expires=${expirationDate.toUTCString()}; path=/`;

  document.cookie = cookieValue;
};

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("login-username").value;
  const loginPin = document.getElementById("login-pin");
  const pin = loginPin.value;

  if (users[username] && users[username]['pin'] == pin) {
    const loginBtn = document.getElementById("login-button");
    loginBtn.disabled = true;
    let loggedInfo = '¡Sesión iniciada con éxito!';
    displayLoginMessage(undefined, loggedInfo, false);
    createLoginCookie(username, users[username]['token'], 90);
    setTimeout(() => {
      window.location.href = "../Pagina-Principal/index.html";
    }, 1000);

  } else {
    let errorType = 'Credenciales incorrectas';
    let errorInfo = 'Nombre de usuario o pin no válidos';
    displayLoginMessage(errorType, errorInfo, true);
    loginPin.value = '';
  };
});

const fetchUsers = async () => {
  const response = await fetch('../text/users.txt');
  const data = response.json();
  return data;
};

const initializeLoginPage = async () => {
  const loginBtn = document.getElementById("login-button");
  loginBtn.disabled = true;

  users = await fetchUsers();

  if (document.cookie) {
    const cookieValue = document.cookie.split('!');
    const cookieUsername = cookieValue[0].split('=')[1];
    const cookieToken = cookieValue[1]
    if (users[cookieUsername] && cookieToken === users[cookieUsername]['token']) {
      window.location.replace("../Pagina-Principal/index.html");
    };
  };

  loginBtn.disabled = false;
};

initializeLoginPage();