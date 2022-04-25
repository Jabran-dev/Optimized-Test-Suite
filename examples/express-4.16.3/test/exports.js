
var express = require('../');
var request = require('supertest');
var should = require('should');

describe('exports', function(){
it('-252-should expose Router', function(){
    express.Router.should.be.a.Function()
  })

it('-253-should expose the application prototype', function(){
    express.application.set.should.be.a.Function()
  })

it('-254-should expose the request prototype', function(){
    express.request.accepts.should.be.a.Function()
  })

it('-255-should expose the response prototype', function(){
    express.response.send.should.be.a.Function()
  })

it('-256-should permit modifying the .application prototype', function(){
    express.application.foo = function(){ return 'bar'; };
    express().foo().should.equal('bar');
  })

it('-257-should permit modifying the .request prototype', function(done){
    express.request.foo = function(){ return 'bar'; };
    var app = express();

    app.use(function(req, res, next){
      res.end(req.foo());
    });

    request(app)
    .get('/')
    .expect('bar', done);
  })

it('-258-should permit modifying the .response prototype', function(done){
    express.response.foo = function(){ this.send('bar'); };
    var app = express();

    app.use(function(req, res, next){
      res.foo();
    });

    request(app)
    .get('/')
    .expect('bar', done);
  })

it('-259-should throw on old middlewares', function(){
    var error;
    try { express.bodyParser; } catch (e) { error = e; }
    should(error).have.property('message');
    error.message.should.containEql('middleware');
    error.message.should.containEql('bodyParser');
  })
})
