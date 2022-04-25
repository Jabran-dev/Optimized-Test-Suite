
var app = require('../../examples/cookies')
  , request = require('supertest');
var utils = require('../support/utils');

describe('cookies', function(){
  describe('GET /', function(){
    it('-773-should have a form', function(done){
      request(app)
      .get('/')
      .expect(/<form/, done);
    })

    it('-774-should respond with no cookies', function(done){
      request(app)
      .get('/')
      .expect(utils.shouldNotHaveHeader('Set-Cookie'))
      .expect(200, done)
    })

    it('-775-should respond to cookie', function(done){
      request(app)
      .post('/')
      .type('urlencoded')
      .send({ remember: 1 })
      .expect(302, function(err, res){
        if (err) return done(err)
        request(app)
        .get('/')
        .set('Cookie', res.headers['set-cookie'][0])
        .expect(200, /Remembered/, done)
      })
    })
  })

  describe('GET /forget', function(){
    it('-776-should clear cookie', function(done){
      request(app)
      .post('/')
      .type('urlencoded')
      .send({ remember: 1 })
      .expect(302, function(err, res){
        if (err) return done(err)
        request(app)
        .get('/forget')
        .set('Cookie', res.headers['set-cookie'][0])
        .expect('Set-Cookie', /remember=;/)
        .expect(302, done)
      })
    })
  })

  describe('POST /', function(){
    it('-777-should set a cookie', function(done){
      request(app)
      .post('/')
      .type('urlencoded')
      .send({ remember: 1 })
      .expect('Set-Cookie', /remember=1/)
      .expect(302, done)
    })

    it('-778-should no set cookie w/o reminder', function(done){
      request(app)
      .post('/')
      .send({})
      .expect(utils.shouldNotHaveHeader('Set-Cookie'))
      .expect(302, done)
    })
  })
})
