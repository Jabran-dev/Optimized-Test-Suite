
var assert = require('assert');
var express = require('..');

describe('config', function () {
  describe('.set()', function () {
it('-234-should set a value', function () {
      var app = express();
      app.set('foo', 'bar');
      assert.equal(app.get('foo'), 'bar');
    })

it('-235-should return the app', function () {
      var app = express();
      assert.equal(app.set('foo', 'bar'), app);
    })

it('-236-should return the app when undefined', function () {
      var app = express();
      assert.equal(app.set('foo', undefined), app);
    })

    describe('"etag"', function(){
it('-237-should throw on bad value', function(){
        var app = express();
        assert.throws(app.set.bind(app, 'etag', 42), /unknown value/);
      })

it('-238-should set "etag fn"', function(){
        var app = express()
        var fn = function(){}
        app.set('etag', fn)
        assert.equal(app.get('etag fn'), fn)
      })
    })

    describe('"trust proxy"', function(){
it('-239-should set "trust proxy fn"', function(){
        var app = express()
        var fn = function(){}
        app.set('trust proxy', fn)
        assert.equal(app.get('trust proxy fn'), fn)
      })
    })
  })

  describe('.get()', function(){
it('-240-should return undefined when unset', function(){
      var app = express();
      assert.strictEqual(app.get('foo'), undefined);
    })

it('-241-should otherwise return the value', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.equal(app.get('foo'), 'bar');
    })

    describe('when mounted', function(){
it('-242-should default to the parent app', function(){
        var app = express();
        var blog = express();

        app.set('title', 'Express');
        app.use(blog);
        assert.equal(blog.get('title'), 'Express');
      })

it('-243-should given precedence to the child', function(){
        var app = express();
        var blog = express();

        app.use(blog);
        app.set('title', 'Express');
        blog.set('title', 'Some Blog');

        assert.equal(blog.get('title'), 'Some Blog');
      })

it('-244-should inherit "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn() { return false }

        app.set('trust proxy', fn);
        assert.equal(app.get('trust proxy'), fn);
        assert.equal(app.get('trust proxy fn'), fn);

        app.use(blog);

        assert.equal(blog.get('trust proxy'), fn);
        assert.equal(blog.get('trust proxy fn'), fn);
      })

it('-245-should prefer child "trust proxy" setting', function () {
        var app = express();
        var blog = express();

        function fn1() { return false }
        function fn2() { return true }

        app.set('trust proxy', fn1);
        assert.equal(app.get('trust proxy'), fn1);
        assert.equal(app.get('trust proxy fn'), fn1);

        blog.set('trust proxy', fn2);
        assert.equal(blog.get('trust proxy'), fn2);
        assert.equal(blog.get('trust proxy fn'), fn2);

        app.use(blog);

        assert.equal(app.get('trust proxy'), fn1);
        assert.equal(app.get('trust proxy fn'), fn1);
        assert.equal(blog.get('trust proxy'), fn2);
        assert.equal(blog.get('trust proxy fn'), fn2);
      })
    })
  })

  describe('.enable()', function(){
it('-246-should set the value to true', function(){
      var app = express();
      assert.equal(app.enable('tobi'), app);
      assert.strictEqual(app.get('tobi'), true);
    })
  })

  describe('.disable()', function(){
it('-247-should set the value to false', function(){
      var app = express();
      assert.equal(app.disable('tobi'), app);
      assert.strictEqual(app.get('tobi'), false);
    })
  })

  describe('.enabled()', function(){
it('-248-should default to false', function(){
      var app = express();
      assert.strictEqual(app.enabled('foo'), false);
    })

it('-249-should return true when set', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.strictEqual(app.enabled('foo'), true);
    })
  })

  describe('.disabled()', function(){
it('-250-should default to true', function(){
      var app = express();
      assert.strictEqual(app.disabled('foo'), true);
    })

it('-251-should return false when set', function(){
      var app = express();
      app.set('foo', 'bar');
      assert.strictEqual(app.disabled('foo'), false);
    })
  })
})
