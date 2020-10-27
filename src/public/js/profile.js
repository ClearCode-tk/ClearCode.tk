(() => {
  // UserInfo //
  const userInfo = JSON.parse(document.getElementById("userInfo").innerText);

  // Project Loader //
  // <div class="clode">
  //   <p class="clode">Test Clode</p>
  //   <div class = "options">
  //     <span class="delete"></span>
  //     <span class="storage"></span>
  //     <span class="options"></span>
  //   </div>
  // </div>

  const clodesEl = document.querySelector(".clodes");
  const userProjects = userInfo?.projects || {};

  for (let key in userProjects) {
    const project = userProjects[key];
    
    const wrapper = document.createElement("div"); // <div class="clode">
    wrapper.className = "clode";

    const title = document.createElement("p"); // <p class="clode">
    title.className = "clode";
    title.innerText = project.name;

    const optionsParent = document.createElement("div"); // <div class="options">
    optionsParent.className = "options";

    const deleteE = document.createElement("span"); // <span class="delete">
    deleteE.className = "delete";

    const storage = document.createElement("span"); // <span class="storage">
    storage.className = "storage";

    const options = document.createElement("span"); // <span class="options">
    options.className = "options";

    const link = document.createElement("a");
    link.href = `/@${userInfo.fulluser}/${project.name}`;

    optionsParent.append(deleteE);
    optionsParent.append(storage);
    optionsParent.append(options);

    wrapper.append(title);
    wrapper.append(optionsParent);
    link.append(wrapper);
    clodesEl.append(link);
  }

  // Create Clode Box //
  const createBox = document.getElementById("createBox");
  const form = (createBox) ? createBox.querySelector("form") : {};
  const bgoverlay = document.getElementsByClassName("bgoverlay")[0] || null;
  if (bgoverlay) bgoverlay.addEventListener("click", closeCreator);
  const langList =  document.getElementById("language");

  // Close the Clode Creation box
  const clodeCancel = document.getElementById("clode-cancel");
  clodeCancel.addEventListener("click", closeCreator);

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