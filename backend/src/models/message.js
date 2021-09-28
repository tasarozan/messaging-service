const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        maxDepth: 1,
      },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: {
        maxDepth: 1,
      },
    },
  },
  { timestamps: true }
)

messageSchema.plugin(autopopulate)
module.exports = mongoose.model('Message', messageSchema)
