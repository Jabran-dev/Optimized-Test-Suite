var app = require('../../examples/vhost')
var request = require('supertest')

describe('vhost', function(){
  describe('example.com', function(){
    describe('GET /', function(){
      it('-843-should say hello', function(done){
        request(app)
        .get('/')
        .set('Host', 'example.com')
        .expect(200, /hello/i, done)
      })
    })

    describe('GET /foo', function(){
      it('-844-should say foo', function(done){
        request(app)
        .get('/foo')
        .set('Host', 'example.com')
        .expect(200, 'requested foo', done)
      })
    })
  })

  describe('foo.example.com', function(){
    describe('GET /', function(){
      it('-845-should redirect to /foo', function(done){
        request(app)
        .get('/')
        .set('Host', 'foo.example.com')
        .expect(302, /Redirecting to http:\/\/example.com:3000\/foo/, done)
      })
    })
  })

  describe('bar.example.com', function(){
    describe('GET /', function(){
      it('-846-should redirect to /bar', function(done){
        request(app)
        .get('/')
        .set('Host', 'bar.example.com')
        .expect(302, /Redirecting to http:\/\/example.com:3000\/bar/, done)
      })
    })
  })
})
