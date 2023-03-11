const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {genmes,genloc} = require('./utils/messages')
const {addUsers,removeUser,getUsersInRoom,getUser} = require('./utils/users')

const server = http.createServer(app)

const io = socketio(server)


io.on('connection', (socket) => {
    console.log('websocket connection successful')

    // socket.emit('countUpdated', count)

    // socket.on('increment', () => {
    //     count++
    //     io.emit('countUpdated', count)
    // })
  
   
    socket.on('join', ({Name,Room},callback) => {

        const {error, newUser} = addUsers({
            id : socket.id,
            Name,
            Room
        })

        if(error){
           return callback(error)
        }

        socket.join(newUser.Room)
        socket.emit('newMessage', genmes('Admin','Welcome!'))

        socket.broadcast.to(newUser.Room).emit('newMessage', genmes('Admin',`${newUser.Name} has joined the room!`))
        callback()

        io.to(newUser.Room).emit('roomdata', {
            room : newUser.Room,
            users : getUsersInRoom(newUser.Room)
        })
    })
   
   
    socket.on('sendMessage', (message,callback) => {

        const user = getUser(socket.id)

        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Gaali mat de bc!')
        }
        io.to(user.Room).emit('newMessage', genmes(user.Name,message))
        callback()
    })

    socket.on('sendlocation', ({lat,lon}, callback) => {
        const user = getUser(socket.id)
        io.to(user.Room).emit('locationmessage', genloc(user.Name,`http://google.com/maps?q=${lat},${lon}`))
        callback("Location Shared!")
    })

    socket.on('disconnect', () => {
        const olduser = removeUser(socket.id)
        if(olduser){
        io.to(olduser.Room).emit('newMessage', genmes('Admin',`${olduser.Name} has left the room!`))
        io.to(olduser.Room).emit('roomdata', {
            room : olduser.Room,
            users : getUsersInRoom(olduser.Room)
        })
    }
})
})


const port = process.env.PORT || 3000

const pathHtm = path.join(__dirname,'../public')

app.use(express.static(pathHtm))

app.get('/', (req,res) => {
    res.render('index')
})


server.listen(port, (socket) => {
    console.log('Server is up and running at port ', port)


})