const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')
const cors = require('cors')
const { UrlMongo } = require('./database')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

mongoose.connect(UrlMongo, { useNewUrlParser: true })

app.use((req, res, next) => {
    req.io = io
    return next
})

app.use(cors)
app.use(express.json())
app.use(routes)

server.listen(3000, () => 
    console.log('Listening on port 3000')
)
