const io = require('socket.io')({
  allowEIO3: true,
})

io.on('connect', socket => {
  socket.on('new message', message => {
    socket.emit('new live stream message', message)

    socket.on('join conversation', conversationId => {
      socket.join(conversationId)
    })
  })
})

module.exports = io
