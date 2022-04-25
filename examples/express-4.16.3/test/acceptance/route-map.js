
var request = require('supertest')
  , app = require('../../examples/route-map');

describe('route-map', function(){
  describe('GET /users', function(){
    it('-828-should respond with users', function(done){
      request(app)
      .get('/users')
      .expect('user list', done);
    })
  })

  describe('DELETE /users', function(){
    it('-829-should delete users', function(done){
      request(app)
      .del('/users')
      .expect('delete users', done);
    })
  })

  describe('GET /users/:id', function(){
    it('-830-should get a user', function(done){
      request(app)
      .get('/users/12')
      .expect('user 12', done);
    })
  })

  describe('GET /users/:id/pets', function(){
    it('-831-should get a users pets', function(done){
      request(app)
      .get('/users/12/pets')
      .expect('user 12\'s pets', done);
    })
  })

  describe('GET /users/:id/pets/:pid', function(){
    it('-832-should get a users pet', function(done){
      request(app)
      .del('/users/12/pets/2')
      .expect('delete 12\'s pet 2', done);
    })
  })
})
