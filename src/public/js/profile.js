(() => {
  const createBox = document.getElementById("createBox");
  const form = (createBox) ? createBox.querySelector("form") : {};
  const bgoverlay = document.getElementsByClassName("bgoverlay")[0] || null;
  if (bgoverlay) bgoverlay.addEventListener("click", closeCreator);
  const langList =  document.getElementById("language");

  const createClodes = document.querySelectorAll(".clode-create");
  for (let i = 0; i < createClodes.length; i++) {
    const clodeBtn = createClodes[i];

    clodeBtn.addEventListener("click", openCreator);
  }

  async function populateLangs(el) {
    const resp = await fetch(`/ide/config`);
    const config = await resp.json();
    const languages = config.languages;

    el.innerHTML = "<option value=\"\" disabled selected>Select a Language</option>";

    for (const lang of languages) {
      el.innerHTML += `<option value="${lang}">${lang}</option>`;
    }
  }

  function openCreator() {
    createBox.style.display = "flex";
    bgoverlay.style.display = "block";

    populateLangs(langList);
    bgoverlay.addEventListener("click", closeCreator);
  }

  function closeCreator(e) {
    createBox.style.display = "";
    bgoverlay.style.display = "";

    bgoverlay.removeEventListener("click", closeCreator);
  }
})();