const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { users, joinUser, currentUser,userLeave,getRoomUsers } = require('./utils/users')
const toLocalStorage = require('./utils/storage')

const app = express()
const server = http.createServer(app) 
const io = socketio(server)

const PORT = process.env.PORT || 5000; 

// Set the static folders 
app.use(express.static(path.join(__dirname,'public/views')))

// App runing when client connected 
io.on('connect', socket => {
  // io.emit() : emit the message for everyone

  socket.on('joinRoom', ({username,room}) => {
    const user = joinUser(socket.id,username,room)
 
    socket.join(user.room)

    // Emit the message for all the users in the room except the current user
    socket.to(user.room).broadcast.emit(
      "message",
      formatMessage("Messenger app", `${user.username} has been connected`)
    )

    // Emit the message for just the connected user in the room
    socket.emit(
      "message",
      formatMessage("Messenger app", `Welcome to your chat ${user.username.toUpperCase()}`)
    )

    // send users and room info 
    io.to(user.room).emit('usersRoom', {
      room: user.room, 
      users: getRoomUsers(user.room)
    })
  })

  // chatMessage event
  socket.on("chatMessage", (msg) => {
    const user = currentUser(socket.id)
    const messageObj = formatMessage(user.username, msg)

    socket.join(user.room)

    io.to(user.room).emit("message", messageObj)

    
  })

  socket.on("disconnect", () => {
    const user = userLeave(socket.id)
    if(user) {
      io.to(user.room).emit(
        "message",
        formatMessage("Messenger app", `${user.username} left the chatroom !`)
      )

      //send users and room info
      io.to(user.room).emit("usersRoom", {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }
    
  })

})


server.listen(PORT,() => console.log(`The application is working on the port : ${PORT}`) )