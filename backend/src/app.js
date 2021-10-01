const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')

const User = require('./models/user')

const mongooseConnection = require('./database-connection')
const socketService = require('./socket-service')

const usersRouter = require('./routes/users')
const accountRouter = require('./routes/account')
const messagesRouter = require('./routes/messages')
const conversationsRouter = require('./routes/conversations')

const app = express()

if (app.get('env') == 'development') {
  /* eslint-disable-next-line */
  app.use(require('connect-livereload')())
  /* eslint-disable-next-line */
  require('livereload')
    .createServer({ extraExts: ['pug'] })
    .watch([`${__dirname}/public`, `${__dirname}/views`])
}

app.set('io', socketService)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  session({
    secret: ['thisisasupersecuresecretsecretsecretssssshhhhhhh', 'ssssshhhhhhhsuperextraperfectsecretsecretsssshhhhhh'],
    store: MongoStore.create({ mongoUrl: mongooseConnection._connectionString, stringify: false }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'strict',
      secure: process.env.NODE_ENV == 'production',
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/account', accountRouter)
app.use('/api/users', usersRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/conversations', conversationsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
