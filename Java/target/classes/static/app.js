const templates = {
	usuario: `{
"nombre":"",
"apellidos":"",
"email":"",
"telefono":"",
"fechaNacimiento":"2000-01-01",
"pasaporte":{
	"numero":"",
	"paisExpedicion":"",
	"fechaCaducidad":"2030-01-01"
	}
}`,
	guia: `{
"nombre":"",
"apellidos":"",
"especialidad":"HISTORIA"
}`,
	destino: `{
"ciudad":"",
"pais":"",
"precio":0,
"requierePasaporte":false
}`,
	pasaporte: `{
"numero":"",
"paisExpedicion":"",
"fechaCaducidad":"2030-01-01",
"idUsuario": 1
}`,
	reserva: `{
"idUsuario": 1,
"idDestino": 1,
"fechaInicio":"2026-03-26"
}`
};
function updatePaths() {
  const entity = getSelectedEntity();
  document.getElementById("pathGetAll").value = `/api/${entity}`;
  document.getElementById("pathGetById").value = `/api/${entity}/`;
  document.getElementById("pathPost").value = `/api/${entity}`;
  document.getElementById("pathPut").value = `/api/${entity}/`;
  document.getElementById("pathDelete").value = `/api/${entity}/`;
  
  document.getElementById("pathGuiaDestinoId").value = `/api/guia/destino/`;
  document.getElementById("pathGuiaDestinoNull").value = `/api/guia/destinoNull`;  
  document.getElementById("pathGuiaAddDestino").value = `/api/guia/`;
  document.getElementById("pathGuiaRemoveDestino").value = `/api/guia/`
  
  document.getElementById("pathUsuarioDestinoId").value = `/api/usuario/destino/`;
}

function loadTemplateTo(textareaId) {
  const entity = getSelectedEntity();
  document.getElementById(textareaId).value = templates[entity];
}

// Inicializa el JSONEditor
// Inicializar editor una sola vez
const response = document.getElementById("response");
const status = document.getElementById("status");

// JSONEditor en modo solo lectura
const jsonEditor = new JSONEditor(response, {
  mode: "view",
  mainMenuBar: false,
  navigationBar: true,
  statusBar: false
});

function showResult(response, text) {
  // mostrar status en el panel lateral
  status.innerText = response.status;
  try {
    const json = JSON.parse(text);
    jsonEditor.set(json); // solo si es JSON válido
  } catch (e) {
    jsonEditor.set({}); // vacía el editor si no es JSON válido
  }
}

function clearResult() {
  jsonEditor.set({});
  status.innerText = "";
	document.getElementById("dominio").value = "localhost"; 
    document.getElementById("puerto").value = "8080";
	updatePaths();
}

/* API CALLS */
function getBaseUrl() {
  return "http://" 
    + document.getElementById("dominio").value 
    + ":" 
    + document.getElementById("puerto").value;
}
function getSelectedEntity() {
  return document.getElementById("crudEntity").value;
}

async function getAll() {
  let path = document.getElementById("pathGetAll").value;
  let r = await fetch(getBaseUrl() + path);
  let t = await r.text();
  showResult(r, t);
}

async function getById(id) {
  let basePath = document.getElementById("pathGetById").value;
  let r = await fetch(getBaseUrl() + basePath + id);
  let t = await r.text();
  showResult(r, t);
}

async function post(body) {
  let path = document.getElementById("pathPost").value;
  let r = await fetch(getBaseUrl() + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body
  });
  let t = await r.text();
  showResult(r, t);
}

async function put(id, body) {
  let basePath = document.getElementById("pathPut").value;
  let r = await fetch(getBaseUrl() + basePath + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: body
  });
  let t = await r.text();
  showResult(r, t);
}

async function deleteById(id) {
  let basePath = document.getElementById("pathDelete").value;
  let r = await fetch(getBaseUrl() + basePath + id, {
    method: "DELETE"
  });
  let t = await r.text();
  showResult(r, t);
}

async function getGuiasDestino() {
	let basePath = document.getElementById("pathGuiaDestinoId").value;
	let id = document.getElementById("guiaDestinoId").value
	let r = await fetch(getBaseUrl() + basePath + id)
	let t = await r.text()
	showResult(r, t)
}

async function getGuiasDestinoNull() {
	let path = document.getElementById("pathGuiaDestinoNull").value;
	let r = await fetch(getBaseUrl() + path);
	let t = await r.text();
	showResult(r, t);
}

async function addDestino() {
	let basePath = document.getElementById("pathGuiaAddDestino").value;
	let guiaId = document.getElementById("guiaIdAdd").value;
	let destinoId = document.getElementById("destinoIdAddGuia").value;
	let r = await fetch(getBaseUrl() + basePath + guiaId + "/destino/" + destinoId, {
		method: "PUT"
	});
	let t = await r.text();
	showResult(r, t);
}

async function removeDestino() {
	let basePath = document.getElementById("pathGuiaRemoveDestino").value;
	let guiaId = document.getElementById("guiaIdRemove").value;
	let r = await fetch(getBaseUrl() + basePath + guiaId + "/destino", {
		method: "DELETE"
	});
	let t = await r.text();
	showResult(r, t);
}

async function getUsuariosDestino() {
	let basePath = document.getElementById("pathUsuarioDestinoId").value;
	let id = document.getElementById("usuarioDestinoId").value
	let r = await fetch(getBaseUrl() + basePath + id)
	let t = await r.text()
	showResult(r, t)
}

/* eventos */
document.getElementById("crudEntity").addEventListener("change", () => {
	updatePaths();
  loadTemplateTo("postBody");
  loadTemplateTo("putBody");
});

// inicialización
loadTemplateTo("postBody");
loadTemplateTo("putBody");
updatePaths();