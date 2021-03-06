/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , SessionStrategy = require('../../lib/strategies/session');


describe('SessionStrategy', function() {
  
  var strategy = new SessionStrategy();
  
it('-474-should be named session', function() {
    expect(strategy.name).to.equal('session');
  });
  
  describe('handling a request without a login session', function() {
    var request, pass = false;
  
    before(function(done) {
      chai.passport.use(strategy)
        .pass(function() {
          pass = true;
          done();
        })
        .req(function(req) {
          request = req;
          
          req._passport = {};
          req._passport.session = {};
        })
        .authenticate();
    });
  
it('-475-should pass', function() {
      expect(pass).to.be.true;
    });
    
it('-476-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
  });
  
  describe('handling a request with a login session', function() {
    var strategy = new SessionStrategy(function(user, req, done) {
      done(null, { id: user });
    });
    
    var request, pass = false;
  
    before(function(done) {
      chai.passport.use(strategy)
        .pass(function() {
          pass = true;
          done();
        })
        .req(function(req) {
          request = req;
          
          req._passport = {};
          req._passport.instance = {};
          req._passport.session = {};
          req._passport.session.user = '123456';
        })
        .authenticate();
    });
  
it('-477-should pass', function() {
      expect(pass).to.be.true;
    });
    
it('-478-should set user on request', function() {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('123456');
    });
    
it('-479-should maintain session', function() {
      expect(request._passport.session).to.be.an('object');
      expect(request._passport.session.user).to.equal('123456');
    });
  });
  
  describe('handling a request with a login session serialized to 0', function() {
    var strategy = new SessionStrategy(function(user, req, done) {
      done(null, { id: user });
    });
    
    var request, pass = false;
  
    before(function(done) {
      chai.passport.use(strategy)
        .pass(function() {
          pass = true;
          done();
        })
        .req(function(req) {
          request = req;
          
          req._passport = {};
          req._passport.instance = {};
          req._passport.session = {};
          req._passport.session.user = 0;
        })
        .authenticate();
    });
  
it('-480-should pass', function() {
      expect(pass).to.be.true;
    });
    
it('-481-should set user on request', function() {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal(0);
    });
    
it('-482-should maintain session', function() {
      expect(request._passport.session).to.be.an('object');
      expect(request._passport.session.user).to.equal(0);
    });
  });
  
  describe('handling a request with a login session that has been invalidated', function() {
    var strategy = new SessionStrategy(function(user, req, done) {
      done(null, false);
    });
    
    var request, pass = false;
  
    before(function(done) {
      chai.passport.use(strategy)
        .pass(function() {
          pass = true;
          done();
        })
        .req(function(req) {
          request = req;
          
          req._passport = {};
          req._passport.instance = {};
          req._passport.session = {};
          req._passport.session.user = '123456';
        })
        .authenticate();
    });
  
it('-483-should pass', function() {
      expect(pass).to.be.true;
    });
    
it('-484-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-485-should remove user from session', function() {
      expect(request._passport.session).to.be.an('object');
      expect(request._passport.session.user).to.be.undefined;
    });
  });
  
  describe('handling a request with a login session and setting custom user property', function() {
    var strategy = new SessionStrategy(function(user, req, done) {
      done(null, { id: user });
    });
    
    var request, pass = false;
  
    before(function(done) {
      chai.passport.use(strategy)
        .pass(function() {
          pass = true;
          done();
        })
        .req(function(req) {
          request = req;
          
          req._passport = {};
          req._passport.instance = {};
          req._passport.instance._userProperty = 'currentUser';
          req._passport.session = {};
          req._passport.session.user = '123456';
        })
        .authenticate();
    });
  
it('-486-should pass', function() {
      expect(pass).to.be.true;
    });
    
it('-487-should not set "user" on request', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-488-should set "currentUser" on request', function() {
      expect(request.currentUser).to.be.an('object');
      expect(request.currentUser.id).to.equal('123456');
    });
  });
  
  describe('handling a request with a login session that encounters an error when deserializing', function() {
    var strategy = new SessionStrategy(function(user, req, done) {
      done(new Error('something went wrong'));
    });
    
    var request, error;
  
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(err) {
          error = err;
          done();
        })
        .req(function(req) {
          request = req;
          
          req._passport = {};
          req._passport.instance = {};
          req._passport.session = {};
          req._passport.session.user = '123456';
        })
        .authenticate();
    });
  
it('-489-should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('something went wrong');
    });
    
it('-490-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-491-should maintain session', function() {
      expect(request._passport.session).to.be.an('object');
      expect(request._passport.session.user).to.equal('123456');
    });
  });
  
  describe('handling a request that lacks an authenticator', function() {
    var request, error;
  
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(err) {
          error = err;
          done();
        })
        .req(function(req) {
          request = req;
        })
        .authenticate();
    });
  
it('-492-should error', function() {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('passport.initialize() middleware not in use');
    });
    
it('-493-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
  });
  
});
