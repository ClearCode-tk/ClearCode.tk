async function initTerminal() {
  const termEl = document.querySelector("#terminal");

  const term = new Terminal({
    cursorBlink: "block",
    allowTransparency: true,
  });
  window.term = term;

  const fitAddon = new FitAddon.FitAddon();
  term.loadAddon(fitAddon);

  term.open(termEl);
  fitAddon.fit();

  if (!vmSocket) return;

  term.onKey(obj => {
    const e = obj.domEvent;
    const key = obj.key;
    const keyCode = e.keyCode;

    vmSocket.emit("termInput", key);
  });

  vmSocket.on("message", (data) => {
    term.write(data);
  });
}