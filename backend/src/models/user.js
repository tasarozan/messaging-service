const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const passportLocalMongoose = require('passport-local-mongoose')

const Message = require('./message')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  blockedUsers: [
    {
      type: String,
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

class User {
  async sendMessage(information) {
    const { text, receiver } = information
    const message = await Message.create({ text, receiver, sender: this })

    this.messages.push(message)

    await this.save()
    return message
  }
}

userSchema.loadClass(User)
userSchema.plugin(autopopulate)
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username',
})
module.exports = mongoose.model('User', userSchema)
