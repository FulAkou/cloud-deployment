require("dotenv").config();
const express = require("express");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
const connectToMongobd = require("./config/db");
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

connectToMongobd();

app.use("/", noteRoutes);

app.listen(port, () =>
  console.log("Serveur backend sur http://localhost:" + port)
);
