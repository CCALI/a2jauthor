require('babel-polyfill')

const path = require('path')
const helmet = require('helmet')
const logger = require('morgan')
const feathers = require('feathers')
const rest = require('feathers-rest')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const assemble = require('./routes/assemble')
const templates = require('./routes/templates')
const topicsResourcesResources = require('./routes/topics-resources-resources')
const topicsResourcesTopics = require('./routes/topics-resources-topics')
const template = require('./routes/template')
const forwardCookies = require('./util/cookies').forwardCookies
const pdfRouter = require('./pdf/router').router

const app = feathers()

app.configure(rest())
  .use(helmet())
  .use(logger('dev'))
  // Increase the bodyParser limits so we can POST largest payloads
  .use(bodyParser.json({ limit: '50mb' }))
  .use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
  .use(cookieParser())
  .use('/', feathers.static(path.join(__dirname, '..')))
  .use('/api/assemble', assemble)
  .use('/api/template', forwardCookies, template)
  .use('/api/templates', forwardCookies, templates)
  .use('/api/topics-resources/resources', topicsResourcesResources)
  .use('/api/topics-resources/topics', topicsResourcesTopics)
  .use('/api/a2j-doc', pdfRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
