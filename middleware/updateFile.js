//Not sure if this is middleware "ok", (i know it is not) but i think it works here.

// yea this isn't middleware

function updateFile(fs, file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), err => {
    if (err) console.log(err);
  });
}

module.exports = updateFile;