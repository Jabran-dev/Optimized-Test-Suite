
var assert = require('assert')
var Buffer = require('safe-buffer').Buffer
var express = require('..');
var methods = require('methods');
var request = require('supertest');
var utils = require('./support/utils');

describe('res', function(){
  describe('.send()', function(){
it('-552-should set body to ""', function(done){
      var app = express();

      app.use(function(req, res){
        res.send();
      });

      request(app)
      .get('/')
      .expect(200, '', done);
    })
  })

  describe('.send(null)', function(){
it('-553-should set body to ""', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(null);
      });

      request(app)
      .get('/')
      .expect('Content-Length', '0')
      .expect(200, '', done);
    })
  })

  describe('.send(undefined)', function(){
it('-554-should set body to ""', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(undefined);
      });

      request(app)
      .get('/')
      .expect(200, '', done);
    })
  })

  describe('.send(code)', function(){
it('-555-should set .statusCode', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(201)
      });

      request(app)
      .get('/')
      .expect('Created')
      .expect(201, done);
    })
  })

  describe('.send(code, body)', function(){
it('-556-should set .statusCode and body', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(201, 'Created :)');
      });

      request(app)
      .get('/')
      .expect('Created :)')
      .expect(201, done);
    })
  })

  describe('.send(body, code)', function(){
it('-557-should be supported for backwards compat', function(done){
      var app = express();

      app.use(function(req, res){
        res.send('Bad!', 400);
      });

      request(app)
      .get('/')
      .expect('Bad!')
      .expect(400, done);
    })
  })

  describe('.send(code, number)', function(){
it('-558-should send number as json', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(200, 0.123);
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, '0.123', done);
    })
  })

  describe('.send(String)', function(){
it('-559-should send as html', function(done){
      var app = express();

      app.use(function(req, res){
        res.send('<p>hey</p>');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, '<p>hey</p>', done);
    })

it('-560-should set ETag', function (done) {
      var app = express();

      app.use(function (req, res) {
        var str = Array(1000).join('-');
        res.send(str);
      });

      request(app)
      .get('/')
      .expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
      .expect(200, done);
    })

it('-561-should not override Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain').send('hey');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200, 'hey', done);
    })

it('-562-should override charset in Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain; charset=iso-8859-1').send('hey');
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200, 'hey', done);
    })

it('-563-should keep charset in Content-Type for Buffers', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain; charset=iso-8859-1').send(Buffer.from('hi'))
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=iso-8859-1')
      .expect(200, 'hi', done);
    })
  })

  describe('.send(Buffer)', function(){
it('-564-should send as octet-stream', function(done){
      var app = express();

      app.use(function(req, res){
        res.send(Buffer.from('hello'))
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/octet-stream')
      .expect(200, 'hello', done);
    })

it('-565-should set ETag', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.send(Buffer.alloc(999, '-'))
      });

      request(app)
      .get('/')
      .expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
      .expect(200, done);
    })

it('-566-should not override Content-Type', function(done){
      var app = express();

      app.use(function(req, res){
        res.set('Content-Type', 'text/plain').send(Buffer.from('hey'))
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(200, 'hey', done);
    })

it('-567-should not override ETag', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.type('text/plain').set('ETag', '"foo"').send(Buffer.from('hey'))
      })

      request(app)
      .get('/')
      .expect('ETag', '"foo"')
      .expect(200, 'hey', done)
    })
  })

  describe('.send(Object)', function(){
it('-568-should send as application/json', function(done){
      var app = express();

      app.use(function(req, res){
        res.send({ name: 'tobi' });
      });

      request(app)
      .get('/')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, '{"name":"tobi"}', done)
    })
  })

  describe('when the request method is HEAD', function(){
it('-569-should ignore the body', function(done){
      var app = express();

      app.use(function(req, res){
        res.send('yay');
      });

      request(app)
      .head('/')
      .expect('', done);
    })
  })

  describe('when .statusCode is 204', function(){
it('-570-should strip Content-* fields, Transfer-Encoding field, and body', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(204).set('Transfer-Encoding', 'chunked').send('foo');
      });

      request(app)
      .get('/')
      .expect(utils.shouldNotHaveHeader('Content-Type'))
      .expect(utils.shouldNotHaveHeader('Content-Length'))
      .expect(utils.shouldNotHaveHeader('Transfer-Encoding'))
      .expect(204, '', done);
    })
  })

  describe('when .statusCode is 304', function(){
it('-571-should strip Content-* fields, Transfer-Encoding field, and body', function(done){
      var app = express();

      app.use(function(req, res){
        res.status(304).set('Transfer-Encoding', 'chunked').send('foo');
      });

      request(app)
      .get('/')
      .expect(utils.shouldNotHaveHeader('Content-Type'))
      .expect(utils.shouldNotHaveHeader('Content-Length'))
      .expect(utils.shouldNotHaveHeader('Transfer-Encoding'))
      .expect(304, '', done);
    })
  })

it('-547-should always check regardless of length', function(done){
    var app = express();
    var etag = '"asdf"';

    app.use(function(req, res, next){
      res.set('ETag', etag);
      res.send('hey');
    });

    request(app)
    .get('/')
    .set('If-None-Match', etag)
    .expect(304, done);
  })

it('-548-should respond with 304 Not Modified when fresh', function(done){
    var app = express();
    var etag = '"asdf"';

    app.use(function(req, res){
      var str = Array(1000).join('-');
      res.set('ETag', etag);
      res.send(str);
    });

    request(app)
    .get('/')
    .set('If-None-Match', etag)
    .expect(304, done);
  })

it('-549-should not perform freshness check unless 2xx or 304', function(done){
    var app = express();
    var etag = '"asdf"';

    app.use(function(req, res, next){
      res.status(500);
      res.set('ETag', etag);
      res.send('hey');
    });

    request(app)
    .get('/')
    .set('If-None-Match', etag)
    .expect('hey')
    .expect(500, done);
  })

it('-550-should not support jsonp callbacks', function(done){
    var app = express();

    app.use(function(req, res){
      res.send({ foo: 'bar' });
    });

    request(app)
    .get('/?callback=foo')
    .expect('{"foo":"bar"}', done);
  })

it('-551-should be chainable', function (done) {
    var app = express()

    app.use(function (req, res) {
      assert.equal(res.send('hey'), res)
    })

    request(app)
    .get('/')
    .expect(200, 'hey', done)
  })

  describe('"etag" setting', function () {
    describe('when enabled', function () {
it('-572-should send ETag', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.send('kajdslfkasdf');
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect('ETag', 'W/"c-IgR/L5SF7CJQff4wxKGF/vfPuZ0"')
        .expect(200, done);
      });

      methods.forEach(function (method) {
        if (method === 'connect') return;

it('-573-should send ETag in response to ' + method.toUpperCase() + ' request', function (done) {
          var app = express();

          app[method]('/', function (req, res) {
            res.send('kajdslfkasdf');
          });

          request(app)
          [method]('/')
          .expect('ETag', 'W/"c-IgR/L5SF7CJQff4wxKGF/vfPuZ0"')
          .expect(200, done);
        })
      });

it('-607-should send ETag for empty string response', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.send('');
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect('ETag', 'W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
        .expect(200, done);
      })

it('-608-should send ETag for long response', function (done) {
        var app = express();

        app.use(function (req, res) {
          var str = Array(1000).join('-');
          res.send(str);
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect('ETag', 'W/"3e7-qPnkJ3CVdVhFJQvUBfF10TmVA7g"')
        .expect(200, done);
      });

it('-609-should not override ETag when manually set', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.set('etag', '"asdf"');
          res.send(200);
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect('ETag', '"asdf"')
        .expect(200, done);
      });

it('-610-should not send ETag for res.send()', function (done) {
        var app = express();

        app.use(function (req, res) {
          res.send();
        });

        app.enable('etag');

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('ETag'))
        .expect(200, done);
      })
    });

    describe('when disabled', function () {
it('-611-should send no ETag', function (done) {
        var app = express();

        app.use(function (req, res) {
          var str = Array(1000).join('-');
          res.send(str);
        });

        app.disable('etag');

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('ETag'))
        .expect(200, done);
      });

it('-612-should send ETag when manually set', function (done) {
        var app = express();

        app.disable('etag');

        app.use(function (req, res) {
          res.set('etag', '"asdf"');
          res.send(200);
        });

        request(app)
        .get('/')
        .expect('ETag', '"asdf"')
        .expect(200, done);
      });
    });

    describe('when "strong"', function () {
it('-613-should send strong ETag', function (done) {
        var app = express();

        app.set('etag', 'strong');

        app.use(function (req, res) {
          res.send('hello, world!');
        });

        request(app)
        .get('/')
        .expect('ETag', '"d-HwnTDHB9U/PRbFMN1z1wps51lqk"')
        .expect(200, done);
      })
    })

    describe('when "weak"', function () {
it('-614-should send weak ETag', function (done) {
        var app = express();

        app.set('etag', 'weak');

        app.use(function (req, res) {
          res.send('hello, world!');
        });

        request(app)
        .get('/')
        .expect('ETag', 'W/"d-HwnTDHB9U/PRbFMN1z1wps51lqk"')
        .expect(200, done)
      })
    })

    describe('when a function', function () {
it('-615-should send custom ETag', function (done) {
        var app = express();

        app.set('etag', function (body, encoding) {
          var chunk = !Buffer.isBuffer(body)
            ? Buffer.from(body, encoding)
            : body;
          chunk.toString().should.equal('hello, world!');
          return '"custom"';
        });

        app.use(function (req, res) {
          res.send('hello, world!');
        });

        request(app)
        .get('/')
        .expect('ETag', '"custom"')
        .expect(200, done);
      })

it('-616-should not send falsy ETag', function (done) {
        var app = express();

        app.set('etag', function (body, encoding) {
          return undefined;
        });

        app.use(function (req, res) {
          res.send('hello, world!');
        });

        request(app)
        .get('/')
        .expect(utils.shouldNotHaveHeader('ETag'))
        .expect(200, done);
      })
    })
  })
})
