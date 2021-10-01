const io = require('socket.io')({
  allowEIO3: true,
})

io.on('connect', socket => {
  socket.emit('connected')

  socket.on('new message', (userId, message) => {
    socket.broadcast.to(userId).emit('new live conversation message', message)
  })

  socket.on('join conversation', conversationId => {
    socket.join(conversationId)
  })

  socket.on('start conversation', (conversationId, cb) => {
    socket.broadcast.emit('new conversation', conversationId)
    socket.join(conversationId)
    cb(true)
  })
})

module.exports = io
