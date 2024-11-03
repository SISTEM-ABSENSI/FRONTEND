// backend/server.js

const express = require('express')
const path = require('path')

const app = express()
const PORT = 5001

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')))

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})