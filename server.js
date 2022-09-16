var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//var dbUrl = 'mongodb+srv://rohit:Qwerty1@cluster0.fvyaa.mongodb.net/?retryWrites=true&w=majority'
var dbUrl = 'mongodb+srv://rohit:Qwerty1@cluster0.fvyaa.mongodb.net/learning-node'

var Message = mongoose.model('Message', 
    {
        name: String,
        message: String
    }
)

// var messages = [
//     {name:'Tim', message : 'Hi from Tim'},
//     {name:'Hane', message : 'Hello from Jane'}
// ]

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
        if (err)
            sendStatus(500) 
        
        io.emit('messageEvent', req.body)
        res.sendStatus(200)
    })

})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, (err) => {
    if (err) console.log('mongo db connection', err);

    console.log('mongo db connection', 'No-error!');
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})
