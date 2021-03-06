/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , Authenticator = require('../lib/authenticator');


describe('Authenticator', function() {
  
  describe('#initialize', function() {
    
it('-2-should have correct arity', function() {
      var passport = new Authenticator();
      expect(passport.initialize).to.have.length(1);
    });
    
    describe('handling a request', function() {
      var passport = new Authenticator();
      var request, error;

      before(function(done) {
        chai.connect.use(passport.initialize())
          .req(function(req) {
            request = req;
            req.session = {};
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
    
it('-3-should not error', function() {
        expect(error).to.be.undefined;
      });
      
it('-4-should set user property on authenticator', function() {
        expect(passport._userProperty).to.equal('user');
      });
    
it('-5-should not initialize namespace within session', function() {
        expect(request.session.passport).to.be.undefined;
      });
    
it('-6-should expose authenticator on internal request property', function() {
        expect(request._passport).to.be.an('object');
        expect(request._passport.instance).to.be.an.instanceOf(Authenticator);
        expect(request._passport.instance).to.equal(passport);
      });
    
it('-7-should not expose session storage on internal request property', function() {
        expect(request._passport.session).to.be.undefined;
      });
    });
    
    describe('handling a request with custom user property', function() {
      var passport = new Authenticator();
      var request, error;

      before(function(done) {
        chai.connect.use(passport.initialize({ userProperty: 'currentUser' }))
          .req(function(req) {
            request = req;
            req.session = {};
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
    
it('-8-should not error', function() {
        expect(error).to.be.undefined;
      });
      
it('-9-should set user property on authenticator', function() {
        expect(passport._userProperty).to.equal('currentUser');
      });
    
it('-10-should not initialize namespace within session', function() {
        expect(request.session.passport).to.be.undefined;
      });
    
it('-11-should expose authenticator on internal request property', function() {
        expect(request._passport).to.be.an('object');
        expect(request._passport.instance).to.be.an.instanceOf(Authenticator);
        expect(request._passport.instance).to.equal(passport);
      });
    
it('-12-should not expose session storage on internal request property', function() {
        expect(request._passport.session).to.be.undefined;
      });
    });
    
  });
  
  
  describe('#authenticate', function() {
    
it('-13-should have correct arity', function() {
      var passport = new Authenticator();
      expect(passport.authenticate).to.have.length(3);
    });
    
    describe('handling a request', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user);
      };
    
      var passport = new Authenticator();
      passport.use('success', new Strategy());
    
      var request, error;

      before(function(done) {
        chai.connect.use(passport.authenticate('success'))
          .req(function(req) {
            request = req;
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
    
it('-14-should not error', function() {
        expect(error).to.be.undefined;
      });
    
it('-15-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
    
it('-16-should set authInfo', function() {
        expect(request.authInfo).to.be.an('object');
        expect(Object.keys(request.authInfo)).to.have.length(0);
      });
    });
    
    describe('handling a request with instantiated strategy', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user);
      };

      var passport = new Authenticator();

      var request, error;

      before(function(done) {
        chai.connect.use(passport.authenticate(new Strategy()))
          .req(function(req) {
            request = req;

            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });

it('-17-should not error', function() {
        expect(error).to.be.undefined;
      });

it('-18-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });
      
it('-19-should set authInfo', function() {
        expect(request.authInfo).to.be.an('object');
        expect(Object.keys(request.authInfo)).to.have.length(0);
      });
    });
    
  });
  
  
  describe('#authorize', function() {
    
it('-20-should have correct arity', function() {
      var passport = new Authenticator();
      expect(passport.authorize).to.have.length(3);
    });
    
    describe('handling a request', function() {
      function Strategy() {
      }
      Strategy.prototype.authenticate = function(req) {
        var user = { id: '1', username: 'jaredhanson' };
        this.success(user);
      };
    
      var passport = new Authenticator();
      passport.use('success', new Strategy());
    
      var request, error;

      before(function(done) {
        chai.connect.use(passport.authorize('success'))
          .req(function(req) {
            request = req;
          
            req.logIn = function(user, options, done) {
              this.user = user;
              done();
            };
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
    
it('-21-should not error', function() {
        expect(error).to.be.undefined;
      });
    
it('-22-should not set user', function() {
        expect(request.user).to.be.undefined;
      });
    
it('-23-should set account', function() {
        expect(request.account).to.be.an('object');
        expect(request.account.id).to.equal('1');
        expect(request.account.username).to.equal('jaredhanson');
      });
    
it('-24-should not set authInfo', function() {
        expect(request.authInfo).to.be.undefined;
      });
    });
    
  });
  
  describe('#session', function() {
    
it('-25-should have correct arity', function() {
      var passport = new Authenticator();
      expect(passport.session).to.have.length(1);
    });
    
    describe('handling a request', function() {
      var passport = new Authenticator();
      passport.deserializeUser(function(user, done) {
        done(null, { id: user });
      });
    
      var request, error;

      before(function(done) {
        chai.connect.use(passport.session())
          .req(function(req) {
            request = req;
            
            req._passport = {};
            req._passport.instance = {};
            req._passport.session = {};
            req._passport.session.user = '123456';
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
    
it('-26-should not error', function() {
        expect(error).to.be.undefined;
      });
    
it('-27-should set user', function() {
        expect(request.user).to.be.an('object');
        expect(request.user.id).to.equal('123456');
      });
      
it('-28-should maintain session', function() {
        expect(request._passport.session).to.be.an('object');
        expect(request._passport.session.user).to.equal('123456');
      });
    });
    
  });
  
});
