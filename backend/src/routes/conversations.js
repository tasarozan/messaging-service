const express = require('express')

const router = express.Router()

const Conversation = require('../models/conversation')

router.post('/:personId', async (req, res) => {
  try {
    const { user } = req
    const { personId } = req.params
    const senderId = user._id.toString()

    const savedConversation = await Conversation.findOne({
      members: { $all: [senderId, personId] },
    })
    if (savedConversation) {
      return res.send(savedConversation)
    }

    const conversation = await new Conversation({
      members: [senderId, personId],
    })
    await conversation.save()

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

router.get('/receiver/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params

    const conversation = await Conversation.findById(conversationId)

    res.send(conversation)
  } catch (error) {
    res.sendStatus(404)
  }
})
module.exports = router
