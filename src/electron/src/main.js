const { app } = require("electron");

app.once("ready", function () {
  console.log('app ready');
  require("./bootstrap-amd").load("index", () => {
    console.log("loaded");
  });
});
