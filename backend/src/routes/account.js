const express = require('express')

const passport = require('passport')

const router = express.Router()

const User = require('../models/user')

router.get('/session', (req, res) => {
  res.send(req.user)
})

router.post('/', async (req, res) => {
  try {
    const { name, password, username } = req.body

    const user = new User({ name, username })
    await user.setPassword(password)
    await user.save()

    res.send(user)
  } catch (e) {
    res.send('Username taken')
  }
})

router.post('/session', passport.authenticate('local', { failWithError: true }), async (req, res) => {
  res.send(req.user)
})

router.delete('/session', async (req, res, next) => {
  await req.logout()
  req.session.regenerate(err => {
    if (err) return next(err)

    return res.sendStatus(200)
  })
})

module.exports = router
