
var express = require('..');
var request = require('supertest');
var utils = require('./support/utils');

describe('res.vary()', function(){
  describe('with no arguments', function(){
it('-686-should not set Vary', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary();
        res.end();
      });

      request(app)
      .get('/')
      .expect(utils.shouldNotHaveHeader('Vary'))
      .expect(200, done);
    })
  })

  describe('with an empty array', function(){
it('-687-should not set Vary', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary([]);
        res.end();
      });

      request(app)
      .get('/')
      .expect(utils.shouldNotHaveHeader('Vary'))
      .expect(200, done);
    })
  })

  describe('with an array', function(){
it('-688-should set the values', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary(['Accept', 'Accept-Language', 'Accept-Encoding']);
        res.end();
      });

      request(app)
      .get('/')
      .expect('Vary', 'Accept, Accept-Language, Accept-Encoding')
      .expect(200, done);
    })
  })

  describe('with a string', function(){
it('-689-should set the value', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary('Accept');
        res.end();
      });

      request(app)
      .get('/')
      .expect('Vary', 'Accept')
      .expect(200, done);
    })
  })

  describe('when the value is present', function(){
it('-690-should not add it again', function (done) {
      var app = express();

      app.use(function (req, res) {
        res.vary('Accept');
        res.vary('Accept-Encoding');
        res.vary('Accept-Encoding');
        res.vary('Accept-Encoding');
        res.vary('Accept');
        res.end();
      });

      request(app)
      .get('/')
      .expect('Vary', 'Accept, Accept-Encoding')
      .expect(200, done);
    })
  })
})
