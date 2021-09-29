const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    text: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
    },
    sender: {
      type: String,
    },
  },
  { timestamps: true }
)

messageSchema.plugin(autopopulate)
module.exports = mongoose.model('Message', messageSchema)
