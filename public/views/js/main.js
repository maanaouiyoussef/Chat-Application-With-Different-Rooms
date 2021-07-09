const chatForm = document.getElementById('chat-form')
const chat = document.querySelector(".chat-messages")
const socket = io()

// catch the user from url 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// Join Room 
socket.emit('joinRoom', { username,room })

// Message event 
socket.on('message', message => {
  console.log(message)
  // get all the messages from local storage and populate them in the ui
  
  showMessage(message)

  // Scroll to the bottom
  chat.scrollTop = chat.scrollHeight
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    // Get the message text 
    const msg = e.target.elements.msg.value; 
    
    // Emit the message to the server  
    socket.emit('chatMessage', msg)

    // clear the input 
    e.target.elements.msg.value="" 
})

const showMessage = (message) => {
    const messageBox = document.createElement('div'); 
    messageBox.classList.add('message')
    messageBox.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
	${message.text}
	</p>
    `; 
    document.querySelector('.chat-messages').append(messageBox)
} 

socket.on('usersRoom', ({room,users}) => {
    document.getElementById('room-name').innerText = room; 
    const usersRoom = document.getElementById('users')
    let output =""; 

    users.forEach(user => {
        output += `<li>${user.username}</li>`
    })

    usersRoom.innerHTML = output
})

