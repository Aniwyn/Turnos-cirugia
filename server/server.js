require("dotenv").config();
const express = require("express");
const cors = require("cors");
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");
const adminStatusRoutes = require("./routes/administrativeStatusRoutes");
const medicalStatusRoutes = require("./routes/medicalStatusRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/administrative-status", adminStatusRoutes);
app.use("/api/medical-status", medicalStatusRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
