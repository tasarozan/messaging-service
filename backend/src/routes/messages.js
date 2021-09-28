const express = require('express')

const router = express.Router()

const User = require('../models/user')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' })
})

router.post('/', async (req, res) => {
  const { user } = req
  if (!user) return res.sendStatus(401)

  const { text, receiver } = req.body

  const message = await user.sendMessage({ text, receiver, sender: user })

  res.send(message)
})

module.exports = router
