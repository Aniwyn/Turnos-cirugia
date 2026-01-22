require("dotenv").config()
const express = require("express")
const cors = require("cors")
const routes = require('./routes/routes')

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("API OK...")
})

app.use('/api/', routes)

const PORT = process.env.PORT || 5050
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})