const io = require('socket.io')()

io.on('connect', socket => {
  console.log('SIOAHDIOASDIPASJPDOJASOPDJASOPDJASOPDJOASJODP')
  socket.emit('message', 'HEYYYYY')
})

module.exports = io
