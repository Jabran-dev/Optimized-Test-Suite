
var after = require('after');
var should = require('should');
var express = require('../')
  , Route = express.Route
  , methods = require('methods')

describe('Route', function(){
it('-691-should work without handlers', function(done) {
    var req = { method: 'GET', url: '/' }
    var route = new Route('/foo')
    route.dispatch(req, {}, done)
  })

  describe('.all', function(){
it('-692-should add handler', function(done){
      var req = { method: 'GET', url: '/' };
      var route = new Route('/foo');

      route.all(function(req, res, next) {
        req.called = true;
        next();
      });

      route.dispatch(req, {}, function (err) {
        if (err) return done(err);
        should(req.called).be.ok()
        done();
      });
    })

it('-693-should handle VERBS', function(done) {
      var count = 0;
      var route = new Route('/foo');
      var cb = after(methods.length, function (err) {
        if (err) return done(err);
        count.should.equal(methods.length);
        done();
      });

      route.all(function(req, res, next) {
        count++;
        next();
      });

      methods.forEach(function testMethod(method) {
        var req = { method: method, url: '/' };
        route.dispatch(req, {}, cb);
      });
    })

it('-694-should stack', function(done) {
      var req = { count: 0, method: 'GET', url: '/' };
      var route = new Route('/foo');

      route.all(function(req, res, next) {
        req.count++;
        next();
      });

      route.all(function(req, res, next) {
        req.count++;
        next();
      });

      route.dispatch(req, {}, function (err) {
        if (err) return done(err);
        req.count.should.equal(2);
        done();
      });
    })
  })

  describe('.VERB', function(){
it('-695-should support .get', function(done){
      var req = { method: 'GET', url: '/' };
      var route = new Route('');

      route.get(function(req, res, next) {
        req.called = true;
        next();
      })

      route.dispatch(req, {}, function (err) {
        if (err) return done(err);
        should(req.called).be.ok()
        done();
      });
    })

it('-696-should limit to just .VERB', function(done){
      var req = { method: 'POST', url: '/' };
      var route = new Route('');

      route.get(function(req, res, next) {
        throw new Error('not me!');
      })

      route.post(function(req, res, next) {
        req.called = true;
        next();
      })

      route.dispatch(req, {}, function (err) {
        if (err) return done(err);
        should(req.called).be.true()
        done();
      });
    })

it('-697-should allow fallthrough', function(done){
      var req = { order: '', method: 'GET', url: '/' };
      var route = new Route('');

      route.get(function(req, res, next) {
        req.order += 'a';
        next();
      })

      route.all(function(req, res, next) {
        req.order += 'b';
        next();
      });

      route.get(function(req, res, next) {
        req.order += 'c';
        next();
      })

      route.dispatch(req, {}, function (err) {
        if (err) return done(err);
        req.order.should.equal('abc');
        done();
      });
    })
  })

  describe('errors', function(){
it('-698-should handle errors via arity 4 functions', function(done){
      var req = { order: '', method: 'GET', url: '/' };
      var route = new Route('');

      route.all(function(req, res, next){
        next(new Error('foobar'));
      });

      route.all(function(req, res, next){
        req.order += '0';
        next();
      });

      route.all(function(err, req, res, next){
        req.order += 'a';
        next(err);
      });

      route.dispatch(req, {}, function (err) {
        should(err).be.ok()
        should(err.message).equal('foobar');
        req.order.should.equal('a');
        done();
      });
    })

it('-699-should handle throw', function(done) {
      var req = { order: '', method: 'GET', url: '/' };
      var route = new Route('');

      route.all(function(req, res, next){
        throw new Error('foobar');
      });

      route.all(function(req, res, next){
        req.order += '0';
        next();
      });

      route.all(function(err, req, res, next){
        req.order += 'a';
        next(err);
      });

      route.dispatch(req, {}, function (err) {
        should(err).be.ok()
        should(err.message).equal('foobar');
        req.order.should.equal('a');
        done();
      });
    });

it('-700-should handle throwing inside error handlers', function(done) {
      var req = { method: 'GET', url: '/' };
      var route = new Route('');

      route.get(function(req, res, next){
        throw new Error('boom!');
      });

      route.get(function(err, req, res, next){
        throw new Error('oops');
      });

      route.get(function(err, req, res, next){
        req.message = err.message;
        next();
      });

      route.dispatch(req, {}, function (err) {
        if (err) return done(err);
        should(req.message).equal('oops');
        done();
      });
    });

it('-701-should handle throw in .all', function(done) {
      var req = { method: 'GET', url: '/' };
      var route = new Route('');

      route.all(function(req, res, next){
        throw new Error('boom!');
      });

      route.dispatch(req, {}, function(err){
        should(err).be.ok()
        err.message.should.equal('boom!');
        done();
      });
    });

it('-702-should handle single error handler', function(done) {
      var req = { method: 'GET', url: '/' };
      var route = new Route('');

      route.all(function(err, req, res, next){
        // this should not execute
        true.should.be.false()
      });

      route.dispatch(req, {}, done);
    });
  })
})
