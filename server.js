const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { format } = require('path')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')


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
   })



   console.log('new ws connect')




   //catre toti
   /* io.emit() */



   //chat message de la client
   socket.on('chatMessage', (msg) => {

      const user = getCurrentUser(socket.id)

      io.to(user.room).emit('message', formatMessage(user.username, msg))


   })


   socket.on('updateCanvas', (msg) => {
      const user = getCurrentUser(socket.id)

      io.to(user.room).emit('canvas', msg)
   })

   const disconnect = () => {

      const user = userLeave(socket.id)

      if (user) {
         io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
         })
         io.emit('message', formatMessage('Admin', `${user.username} has left the chat`))
      }
   }

   //cand se deconecteaza
   socket.on('disconnect', disconnect)
}



io.on('connect', new_web_socket)

const PORT = 3000 || process.env.PORT;



server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

