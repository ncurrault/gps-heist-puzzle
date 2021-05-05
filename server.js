"use strict";

const express = require("express");

const app = express();
const port = 42069;

app.use(express.static("client", { maxage: 0 }));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}.`);
});
