
var assert = require('assert');
var Buffer = require('safe-buffer').Buffer
var utils = require('../lib/utils');

describe('utils.etag(body, encoding)', function(){
it('-738-should support strings', function(){
    utils.etag('express!')
    .should.eql('"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

it('-739-should support utf8 strings', function(){
    utils.etag('express❤', 'utf8')
    .should.eql('"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"')
  })

it('-740-should support buffer', function(){
    utils.etag(Buffer.from('express!'))
    .should.eql('"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

it('-741-should support empty string', function(){
    utils.etag('')
    .should.eql('"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
  })
})

describe('utils.setCharset(type, charset)', function () {
it('-742-should do anything without type', function () {
    assert.strictEqual(utils.setCharset(), undefined);
  });

it('-743-should return type if not given charset', function () {
    assert.strictEqual(utils.setCharset('text/html'), 'text/html');
  });

it('-744-should keep charset if not given charset', function () {
    assert.strictEqual(utils.setCharset('text/html; charset=utf-8'), 'text/html; charset=utf-8');
  });

it('-745-should set charset', function () {
    assert.strictEqual(utils.setCharset('text/html', 'utf-8'), 'text/html; charset=utf-8');
  });

it('-746-should override charset', function () {
    assert.strictEqual(utils.setCharset('text/html; charset=iso-8859-1', 'utf-8'), 'text/html; charset=utf-8');
  });
});

describe('utils.wetag(body, encoding)', function(){
it('-747-should support strings', function(){
    utils.wetag('express!')
    .should.eql('W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

it('-748-should support utf8 strings', function(){
    utils.wetag('express❤', 'utf8')
    .should.eql('W/"a-JBiXf7GyzxwcrxY4hVXUwa7tmks"')
  })

it('-749-should support buffer', function(){
    utils.wetag(Buffer.from('express!'))
    .should.eql('W/"8-O2uVAFaQ1rZvlKLT14RnuvjPIdg"')
  })

it('-750-should support empty string', function(){
    utils.wetag('')
    .should.eql('W/"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"')
  })
})

describe('utils.isAbsolute()', function(){
it('-751-should support windows', function(){
    assert(utils.isAbsolute('c:\\'));
    assert(utils.isAbsolute('c:/'));
    assert(!utils.isAbsolute(':\\'));
  })

it('-752-should support windows unc', function(){
    assert(utils.isAbsolute('\\\\foo\\bar'))
  })

it('-753-should support unices', function(){
    assert(utils.isAbsolute('/foo/bar'));
    assert(!utils.isAbsolute('foo/bar'));
  })
})

describe('utils.flatten(arr)', function(){
it('-754-should flatten an array', function(){
    var arr = ['one', ['two', ['three', 'four'], 'five']];
    utils.flatten(arr)
      .should.eql(['one', 'two', 'three', 'four', 'five']);
  })
})
