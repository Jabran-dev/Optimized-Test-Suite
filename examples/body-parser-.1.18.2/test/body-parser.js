
var http = require('http')
var methods = require('methods')
var request = require('supertest')

var bodyParser = require('..')

describe('bodyParser()', function () {
  before(function () {
    this.server = createServer()
  })

it('-0-should default to {}', function (done) {
    request(this.server)
    .post('/')
    .expect(200, '{}', done)
  })

it('-1-should parse JSON', function (done) {
    request(this.server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send('{"user":"tobi"}')
    .expect(200, '{"user":"tobi"}', done)
  })

it('-2-should parse x-www-form-urlencoded', function (done) {
    request(this.server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send('user=tobi')
    .expect(200, '{"user":"tobi"}', done)
  })

it('-3-should handle duplicated middleware', function (done) {
    var _bodyParser = bodyParser()
    var server = http.createServer(function (req, res) {
      _bodyParser(req, res, function (err0) {
        _bodyParser(req, res, function (err1) {
          var err = err0 || err1
          res.statusCode = err ? (err.status || 500) : 200
          res.end(err ? err.message : JSON.stringify(req.body))
        })
      })
    })

    request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send('{"user":"tobi"}')
    .expect(200, '{"user":"tobi"}', done)
  })

  describe('http methods', function () {
    before(function () {
      var _bodyParser = bodyParser()

      this.server = http.createServer(function (req, res) {
        _bodyParser(req, res, function (err) {
          if (err) {
            res.statusCode = 500
            res.end(err.message)
            return
          }

          res.statusCode = req.body.user === 'tobi'
            ? 201
            : 400
          res.end()
        })
      })
    })

    methods.slice().sort().forEach(function (method) {
      if (method === 'connect') {
        // except CONNECT
        return
      }

it('-4-should support ' + method.toUpperCase() + ' requests', function (done) {
        request(this.server)[method]('/')
        .set('Content-Type', 'application/json')
        .send('{"user":"tobi"}')
        .expect(201, done)
      })
    })
  })

  describe('with type option', function () {
    before(function () {
      this.server = createServer({ limit: '1mb', type: 'application/octet-stream' })
    })

it('-37-should parse JSON', function (done) {
      request(this.server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send('{"user":"tobi"}')
      .expect(200, '{"user":"tobi"}', done)
    })

it('-38-should parse x-www-form-urlencoded', function (done) {
      request(this.server)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('user=tobi')
      .expect(200, '{"user":"tobi"}', done)
    })
  })

  describe('with verify option', function () {
it('-39-should apply to json', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        if (buf[0] === 0x20) throw new Error('no leading space')
      }})

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send(' {"user":"tobi"}')
      .expect(403, 'no leading space', done)
    })

it('-40-should apply to urlencoded', function (done) {
      var server = createServer({verify: function (req, res, buf) {
        if (buf[0] === 0x20) throw new Error('no leading space')
      }})

      request(server)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(' user=tobi')
      .expect(403, 'no leading space', done)
    })
  })
})

function createServer (opts) {
  var _bodyParser = bodyParser(opts)

  return http.createServer(function (req, res) {
    _bodyParser(req, res, function (err) {
      res.statusCode = err ? (err.status || 500) : 200
      res.end(err ? err.message : JSON.stringify(req.body))
    })
  })
}
