
var app = require('../../examples/error-pages')
  , request = require('supertest');

describe('error-pages', function(){
  describe('GET /', function(){
    it('-783-should respond with page list', function(done){
      request(app)
      .get('/')
      .expect(/Pages Example/, done)
    })
  })

  describe('Accept: text/html',function(){
    describe('GET /403', function(){
      it('-784-should respond with 403', function(done){
        request(app)
        .get('/403')
        .expect(403, done)
      })
    })

    describe('GET /404', function(){
      it('-785-should respond with 404', function(done){
        request(app)
        .get('/404')
        .expect(404, done)
      })
    })

    describe('GET /500', function(){
      it('-786-should respond with 500', function(done){
        request(app)
        .get('/500')
        .expect(500, done)
      })
    })
  })

  describe('Accept: application/json',function(){
    describe('GET /403', function(){
      it('-787-should respond with 403', function(done){
        request(app)
        .get('/403')
        .set('Accept','application/json')
        .expect(403, done)
      })
    })

    describe('GET /404', function(){
      it('-788-should respond with 404', function(done){
        request(app)
        .get('/404')
        .set('Accept','application/json')
        .expect(404, { error: 'Not found' }, done)
      })
    })

    describe('GET /500', function(){
      it('-789-should respond with 500', function(done){
        request(app)
        .get('/500')
        .set('Accept', 'application/json')
        .expect(500, done)
      })
    })
  })


  describe('Accept: text/plain',function(){
    describe('GET /403', function(){
      it('-790-should respond with 403', function(done){
        request(app)
        .get('/403')
        .set('Accept','text/plain')
        .expect(403, done)
      })
    })

    describe('GET /404', function(){
      it('-791-should respond with 404', function(done){
        request(app)
        .get('/404')
        .set('Accept', 'text/plain')
        .expect(404)
        .expect('Not found', done);
      })
    })

    describe('GET /500', function(){
      it('-792-should respond with 500', function(done){
        request(app)
        .get('/500')
        .set('Accept','text/plain')
        .expect(500, done)
      })
    })
  })
})
