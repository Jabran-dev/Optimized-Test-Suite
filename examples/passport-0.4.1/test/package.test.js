/* global describe, it, expect */

var passport = require('..');

describe('passport', function() {
  
it('-98-should expose singleton authenticator', function() {
    expect(passport).to.be.an('object');
    expect(passport).to.be.an.instanceOf(passport.Authenticator);
  });
  
it('-99-should export constructors', function() {
    expect(passport.Authenticator).to.equal(passport.Passport);
    expect(passport.Authenticator).to.be.a('function');
    expect(passport.Strategy).to.be.a('function');
  });
  
it('-100-should export strategies', function() {
    expect(passport.strategies.SessionStrategy).to.be.a('function');
  });
  
});
