require.config({ paths: { 'vs': '/monaco-editor/vs' }});

let vmSocket;

function loadThemes() {
  // Defines themes here

  monaco.editor.defineTheme("Epic", {
    
  });
}

function loadMonaco(element, readOnly, { projectUser, projectName, me }) {
  require(['vs/editor/editor.main'], async function() {

  monaco.editor.create(element, {
    value: "test",
    language: "javascript",
    readonly: readOnly
  });

  loadThemes();
  element.childNodes[0].remove(); // Remove loading text

  });
}

function randomInt(length) {
  return Math.floor(Math.random() * length);
}

(async () => {

// Authentication //
let readOnly = (typeof mreadOnly !== "undefined" && mreadOnly) ? mreadOnly : true;
const meResp = await fetch("/api/@me");
const vmResp = await fetch("/api/v1/available");
if (meResp.status !== 200) return location.href = "/";

const me = await meResp.json();
// const vmData = await vmResp.json(); // Uncomment

const projectUser = location.pathname.split("/")[1];
const projectName = location.pathname.split("/")[2];
const projectData = JSON.parse(document.querySelector("#projectData").textContent);

const vms = false ? Object.keys(vmData) : { length: 0 }; // Uncomment
const myVm = (vms.length > 0) ? vmData[vms[randomInt(vms.length)]] : {};

if (vms.length < 1) {
  // alert("There are no available VM at this moment. Redirect to home. Please try again later.");
  // location.href = "/";
} else {
  vmSocket = io(myVm.url);
}

if (
  (`@${me.fulluser}` !== projectUser)
  || (me.fulluser !== projectData.fulluser)
) {
  readOnly = true;
} else {
  readOnly = false;
}

if (vmSocket) {
  vmSocket.on("Connection", () => {
    vmSocket.emit("joined", {
      projectData,
      readOnly,
      me
    });

    initTerminal();
  });
}

document.querySelector("#owner").innerHTML = `IsOwner?: ${!readOnly}`;

const editorEl = document.querySelector("#editor");

// Main Editor Setup //
if (!mobileCheck()) {
  loadMonaco(editorEl, readOnly, {
    projectUser,
    projectName,
    projectData,
    me
  });
} else {
  // load Mobile Editor
}

})();