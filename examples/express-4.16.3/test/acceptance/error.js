
var app = require('../../examples/error')
  , request = require('supertest');

describe('error', function(){
  describe('GET /', function(){
    it('-793-should respond with 500', function(done){
      request(app)
        .get('/')
        .expect(500,done)
    })
  })

  describe('GET /next', function(){
    it('-794-should respond with 500', function(done){
      request(app)
        .get('/next')
        .expect(500,done)
    })
  })

  describe('GET /missing', function(){
    it('-795-should respond with 404', function(done){
      request(app)
        .get('/missing')
        .expect(404,done)
    })
  })
})
