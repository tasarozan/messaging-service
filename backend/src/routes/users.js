const express = require('express')

const router = express.Router()

const User = require('../models/user')

router.get('/', async (req, res) => {
  const users = await User.find({})

  res.send(users)
})

router.get('/search/:username', async (req, res) => {
  const { username } = req.params
  const user = await User.find({ username })

  res.send(user)
})

router.put('/block/:personId', async (req, res) => {
  const { personId } = req.params
  const { user } = req

  await user.updateOne({ $push: { blockedUsers: personId } })

  res.sendStatus(200)
})

router.put('/unblock/:personId', async (req, res) => {
  const { personId } = req.params
  const { user } = req

  await user.updateOne({ $pull: { blockedUsers: personId } })

  res.sendStatus(200)
})
module.exports = router
