const express = require('express')

const router = express.Router()

const Conversation = require('../models/conversation')

router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body
    const savedConversations = await Conversation.find({ members: { $all: [senderId, receiverId] } })
    if (savedConversations) return res.send(savedConversations)

    const conversation = new Conversation({
      members: [senderId, receiverId],
    })

    res.send(conversation)
  } catch (e) {
    res.sendStatus(500)
  }
})

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    })
    res.send(conversation)
  } catch (e) {
    res.sendStatus(404)
  }
})
module.exports = router
