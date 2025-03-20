require("dotenv").config();
const express = require("express");
const cors = require("cors");
const patientRoutes = require('./routes/patientRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Running...");
});
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
