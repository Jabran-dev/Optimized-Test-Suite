
var request = require('supertest')
  , app = require('../../examples/content-negotiation');

describe('content-negotiation', function(){
  describe('GET /', function(){
    it('-764-should default to text/html', function(done){
      request(app)
      .get('/')
      .expect(200, '<ul><li>Tobi</li><li>Loki</li><li>Jane</li></ul>', done)
    })

    it('-765-should accept to text/plain', function(done){
      request(app)
      .get('/')
      .set('Accept', 'text/plain')
      .expect(200, ' - Tobi\n - Loki\n - Jane\n', done)
    })

    it('-766-should accept to application/json', function(done){
      request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200, '[{"name":"Tobi"},{"name":"Loki"},{"name":"Jane"}]', done)
    })
  })

  describe('GET /users', function(){
    it('-767-should default to text/html', function(done){
      request(app)
      .get('/users')
      .expect(200, '<ul><li>Tobi</li><li>Loki</li><li>Jane</li></ul>', done)
    })

    it('-768-should accept to text/plain', function(done){
      request(app)
      .get('/users')
      .set('Accept', 'text/plain')
      .expect(200, ' - Tobi\n - Loki\n - Jane\n', done)
    })

    it('-769-should accept to application/json', function(done){
      request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200, '[{"name":"Tobi"},{"name":"Loki"},{"name":"Jane"}]', done)
    })
  })
})
