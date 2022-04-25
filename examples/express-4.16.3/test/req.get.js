
var express = require('../')
  , request = require('supertest')
  , assert = require('assert');

describe('req', function(){
  describe('.get(field)', function(){
it('-294-should return the header field value', function(done){
      var app = express();

      app.use(function(req, res){
        assert(req.get('Something-Else') === undefined);
        res.end(req.get('Content-Type'));
      });

      request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('application/json', done);
    })

it('-295-should special-case Referer', function(done){
      var app = express();

      app.use(function(req, res){
        res.end(req.get('Referer'));
      });

      request(app)
      .post('/')
      .set('Referrer', 'http://foobar.com')
      .expect('http://foobar.com', done);
    })

it('-296-should throw missing header name', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.end(req.get())
      })

      request(app)
      .get('/')
      .expect(500, /TypeError: name argument is required to req.get/, done)
    })

it('-297-should throw for non-string header name', function (done) {
      var app = express()

      app.use(function (req, res) {
        res.end(req.get(42))
      })

      request(app)
      .get('/')
      .expect(500, /TypeError: name must be a string to req.get/, done)
    })
  })
})
