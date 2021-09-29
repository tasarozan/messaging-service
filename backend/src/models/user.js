const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const passportLocalMongoose = require('passport-local-mongoose')

// const Message = require('./message')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      autopopulate: true,
    },
  ],
})

userSchema.plugin(autopopulate)
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username',
})
module.exports = mongoose.model('User', userSchema)
