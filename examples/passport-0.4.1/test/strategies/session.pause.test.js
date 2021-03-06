/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai');


describe('SessionStrategy', function() {
  
  describe('handling a request with a login session, pausing for deserialization', function() {
    var spy = [];
    
    var pause = function() {
      spy.push({ context: this, args: [].slice.call(arguments) });
      return { resume: function() { spy.push({ context: this, args: [].slice.call(arguments) }); } };
    }
    
    
    var SessionStrategy = $require('../../lib/strategies/session', { pause: pause });
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
        .authenticate({ pauseStream: true });
    });
    
it('-462-should spy correctly', function() {
      expect(spy).to.have.length(2);
    });
  
it('-463-should pass', function() {
      expect(pass).to.be.true;
    });
    
it('-464-should set user on request', function() {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('123456');
    });
    
it('-465-should maintain session', function() {
      expect(request._passport.session).to.be.an('object');
      expect(request._passport.session.user).to.equal('123456');
    });
    
it('-466-should pause request', function() {
      var s0 = spy[0];
      expect(s0.args[0]).to.equal(request);
    });
    
it('-467-should resume request', function() {
      var s1 = spy[1];
      expect(s1.args[0]).to.equal(undefined);
    });
  });
  
  describe('handling a request with a login session that has been invalidated, pausing for deserialization', function() {
    var spy = [];
    
    var pause = function() {
      spy.push({ context: this, args: [].slice.call(arguments) });
      return { resume: function() { spy.push({ context: this, args: [].slice.call(arguments) }); } };
    }
    
    
    var SessionStrategy = $require('../../lib/strategies/session', { pause: pause });
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
        .authenticate({ pauseStream: true });
    });
    
it('-468-should spy correctly', function() {
      expect(spy).to.have.length(2);
    });
  
it('-469-should pass', function() {
      expect(pass).to.be.true;
    });
    
it('-470-should not set user on request', function() {
      expect(request.user).to.be.undefined;
    });
    
it('-471-should remove user from session', function() {
      expect(request._passport.session).to.be.an('object');
      expect(request._passport.session.user).to.be.undefined;
    });
    
it('-472-should pause request', function() {
      var s0 = spy[0];
      expect(s0.args[0]).to.equal(request);
    });
    
it('-473-should resume request', function() {
      var s1 = spy[1];
      expect(s1.args[0]).to.equal(undefined);
    });
  });
  
});
