const clientId =
  "";

// const authSection = document.querySelector(".auth");

// const authUrl =
//   "https://accounts.google.com/o/oauth2/v2/auth" +
//   "&client_id=" +
//   creds.web.client_id +
//   "redirect_uri=http://localhost:5500" +
//   "response_type=token" +
//   "scope=https://www.googleapis.com/auth/drive.metadata.readonly&";

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
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

document.querySelector(".auth a").addEventListener("click", (evt) => {
  evt.preventDefault();
  oauthSignIn();
});

const token = checkToken();

if (token) {
  document.querySelector(".auth").innerHTML =
    "Мы получили токен и можем выполнять запросы!";
}

// =================================================

function createTable() {
  const body = {
    properties: { title: "Название документа", locale: "ru_RU" },
    sheets: [
      {
        properties: {
          sheetType: "GRID",
          sheetId: 0,
          title: "Название листа",
          gridProperties: {
            rowCount: 8,
            columnCount: 5,
          },
        },
      },
    ],
  };
  return fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

const createTableButton = document.querySelector(".createTable");
createTableButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  createTable()
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
});
