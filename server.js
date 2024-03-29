const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { format } = require('path')
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getUsersLength } = require('./utils/users')
const { pointScored, getCoords, getColor, playerReady, canPlay, playerOut, resetGame } = require('./utils/game')

const app = express()


const server = http.createServer(app)
const io = socketio(server)

//Punem folderul static
app.use(express.static(path.join(__dirname, 'public')))


// Ruleaza atunci cand un client se va conecta
// mai exact pentru eventul = connect


const new_web_socket = (socket) => {




   socket.on('joinRoom', ({ username, room }) => {

      // bun venit catre sender
      const user = userJoin(socket.id, username, room)
      console.log(user)
      socket.join(user.room)
      socket.emit('message', formatMessage('Admin', 'Welcome to Room'))

      // Trimite userii si camera
      io.to(user.room).emit('roomUsers', {
         room: user.room,
         users: getRoomUsers(user.room)
      })
      //Va afisa mesajul catre toti userii in afara ce cel care trimite
      socket.broadcast.to(user.room).emit('message', formatMessage('Admin', `${user.username} has joined the chat`))
      if (getUsersLength() == 2) {
         socket.emit('redPoint', getCoords())
      }
   })



   console.log('new ws connect')

   socket.on('readyToPlay', () => {
      playerReady()
      if (canPlay()) {
         const user = getCurrentUser(socket.id)
         io.to(user.room).emit('setCanPlay')
         io.to(user.room).emit('startGame')
         resetGame()
      }
   })

   //chat message de la client
   socket.on('chatMessage', (msg) => {

      const user = getCurrentUser(socket.id)

      io.to(user.room).emit('message', formatMessage(user.username, msg))


   })

   socket.on('updateCanvas', (player) => {
      const user = getCurrentUser(socket.id)
      io.to(user.room).emit('canvas', player)

      io.to(user.room).emit('redPoint', getCoords())
   })
   socket.emit('setColor', getColor())
   socket.on('pointScored', () => pointScored())

   const disconnect = () => {

      const user = userLeave(socket.id)

      if (user) {
         io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
         })
         io.emit('message', formatMessage('Admin', `${user.username} has left the chat`))
      }
      playerOut()
   }

   //cand se deconecteaza
   socket.on('disconnect', disconnect)
}



io.on('connect', new_web_socket)

const PORT = 3000 || process.env.PORT;



server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

