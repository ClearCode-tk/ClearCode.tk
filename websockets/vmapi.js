const Path = require("path");
const fs = require("fs");

class VMData {
  constructor(filepath) {
    this.filepath = filepath;
    this.data = {};
    this.machines = this.data.hasOwnProperty("Machines") ? this.data["Machines"] : {
      "Available": {},
      "Unavailable": {}
    }

    this.parse(filepath);
  }

  pushMachines() {
    return this.data["Machines"] = this.machines;
  }

  parse(filepath = this.filepath) {
    const exists = fs.existsSync(filepath);
    
    if (!exists)
      fs.writeFileSync(filepath, "{}");

    this.data = JSON.parse(fs.readFileSync(filepath));
    this.machines = this.data.hasOwnProperty("Machines") ? this.data["Machines"] : {
      "Available": {},
      "Unavailable": {}
    }
  }

  write(filepath = this.filepath) {
    if (!fs.existsSync(filepath)) return;

    fs.writeFile(filepath, JSON.stringify(this.data, null, 2), (err) => {
      if (err) console.error(err);
    });
  }

  updateMachine(data) {
    const { hostname, allowConnection, availability, wss = "wss://test:5512" } = data;
    if (availability) {
      this.newAvailable(data);
    } else {
      this.newUnavailable(data);
    }

    this.write();
  }

  newAvailable({ hostname, allowConnection = true, availability = true, wss = "testurl:5512" }) {
    if (this.machines["Unavailable"].hasOwnProperty(hostname)) {
      delete this.machines["Unavailable"][hostname];
    }

    this.machines["Available"][hostname] = {
      hostname,
      wss,
      allowConnection
    };

    this.pushMachines();
  }

  newUnavailable({ hostname, allowConnection = false, availability = false, wss = "testurl:5512" }) {
    if (this.machines["Available"].hasOwnProperty(hostname)) {
      delete this.machines["Available"][hostname];
    }

    this.machines["Unavailable"][hostname] = {
      hostname,
      wss,
      allowConnection
    };

    this.pushMachines();
  }
}

const vmInfo = new VMData("./keys/vmdata.json");

module.exports = async function Api(io) {

io.on("connection", socket => {
  
  socket.on("VMAvailibility", (apiData) => {
    vmInfo.updateMachine(apiData);
  });

});

}