const fs = require("fs").promises;
const exec = require("child_process").exec;
const path = require("path");
const pkg = require("./package.json");

const SW_PATH = path.join(__dirname, "/public/service-worker.js");

async function main() {
  try {
    let file = await fs.readFile(SW_PATH, "utf8");

    file = file.replace(/"v\d+\.\d+\.\d+"/, `"v${pkg.version}"`);

    await fs.writeFile(SW_PATH, file, "utf8");

    exec("git add public/service-worker.js");
  } catch (e) {
    console.warn(error);
  }
}

main();
