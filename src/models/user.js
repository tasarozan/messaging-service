const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

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
})

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username',
})
module.exports = mongoose.model('User', userSchema)
