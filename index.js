const clientId =
  "794310186848-uemcu7n2lqtiahu8729862haen9tcbf7.apps.googleusercontent.com"; // Вставьте ваш Client ID

//
// Полное описание процедуры авторизации Google Sheets API для веб-сайтов:
// https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
//
function oauthSignIn() {
  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  // Create <form> element to submit parameters to OAuth 2.0 endpoint.
  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    client_id: clientId,
    redirect_uri: "http://localhost:5500",
    response_type: "token",
    scope: "https://www.googleapis.com/auth/spreadsheets",
    include_granted_scopes: "true",
    state: "pass-through value",
  };

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

//
// Проверка токена при запуске приложения
//
function checkToken() {
  if (!window.location.hash) {
    return null;
  } else {
    return window.location.hash
      .substr(1)
      .split("&")
      .map((part) => part.split("="))
      .reduce((acc, el) => {
        acc[el[0]] = el[1];
        return acc;
      }, {})["access_token"];
  }
}

//
// Обработка клика по ссылке "Получить токен"
//
function authLinkClickHandler(evt) {
  evt.preventDefault();
  oauthSignIn();
}

//
// Это - токен для запросов к Google API в глобальной области видимости.
// Используйте его при выполнении запросов.
//
const token = checkToken();

//
// Проверка авторизации
//
if (token) {
  document.querySelector(".auth").innerHTML =
    "Мы получили токен и можем выполнять запросы!";
} else {
  const authLink = document.querySelector(".auth a");
  authLink.addEventListener("click", authLinkClickHandler);
}
