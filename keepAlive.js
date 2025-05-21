const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot hidup!");
});

function keepAlive() {
  app.listen(3000, () => {
    console.log("Keep-alive server jalan di port 3000");
  });
}

module.exports = keepAlive;