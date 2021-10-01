const express = require('express')

const router = express.Router()

const Message = require('../models/message')

router.post('/', async (req, res) => {
  try {
    const { user } = req
    if (!user) return res.sendStatus(401)

    const { text, receiverId, conversationId } = req.body

    const message = await new Message({ text, receiver: receiverId, conversationId, sender: user._id })

    await message.save()

    res.send(message)
  } catch (e) {
    console.log(e)
    res.sendStatus(500)
  }
})

router.get('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params
    const messages = await Message.find({
      conversationId,
    })
    res.send(messages)
  } catch (err) {
    res.status(404)
  }
})

module.exports = router
