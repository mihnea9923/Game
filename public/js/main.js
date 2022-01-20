
//luam submisia acestui form
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')



//Acces la query Strings
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})




const socket = io()

socket.emit('joinRoom', { username, room })


socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room)
  outputUsers(users)
})


const outputMessage = (message) => {

  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`
  document.querySelector('.chat-messages').appendChild(div)
}

const displayMessage = (message) => {
  console.log(message)

  outputMessage(message)

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight

}

socket.on('message', displayMessage)


//vom scrie un event pentru form-ul 'chat-form'
chatForm.addEventListener('submit', (e) => {
  e.preventDefault()


  const msg = e.target.elements.msg.value


  // Emit message to server
  socket.emit('chatMessage', msg)

  //clear the input
  e.target.elements.msg.value = ''
})


//manipulam mesajul trimis de client in DOM

const outputRoomName = (room) => {
  roomName.innerText = room

}

const outputUsers = (users) => {
  userList.innerHTML = `
    ${users.map((user) => {

    return (`<li>${user.username}</li>`)
  }).join('')} `

}

