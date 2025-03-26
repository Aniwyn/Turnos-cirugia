require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require('./routes/routes');

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API OK..."); //No borrar, se puede cambiar
});

app.use('/api/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});