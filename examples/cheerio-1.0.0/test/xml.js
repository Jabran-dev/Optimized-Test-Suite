var expect = require('expect.js'),
    cheerio = require('..');

var xml = function (str, options) {
  options = Object.assign({ xml: true }, options);
  var $ = cheerio.load(str, options);
  return $.xml();
};

var dom = function (str, options) {
  var $ = cheerio.load('', options);
  return $(str).html();
};

describe('render', function () {
  describe('(xml)', function () {
it('-644-should render <media:thumbnail /> tags correctly', function () {
      var str =
        '<media:thumbnail url="http://www.foo.com/keyframe.jpg" width="75" height="50" time="12:05:01.123" />';
      expect(xml(str)).to.equal(
        '<media:thumbnail url="http://www.foo.com/keyframe.jpg" width="75" height="50" time="12:05:01.123"/>'
      );
    });

it('-645-should render <link /> tags (RSS) correctly', function () {
      var str = '<link>http://www.github.com/</link>';
      expect(xml(str)).to.equal('<link>http://www.github.com/</link>');
    });

it('-646-should escape entities', function () {
      var str = '<tag attr="foo &amp; bar"/>';
      expect(xml(str)).to.equal(str);
    });
  });

  describe('(dom)', function () {
it('-647-should keep camelCase for new nodes', function () {
      var str = '<g><someElem someAttribute="something">hello</someElem></g>';
      expect(dom(str, { xml: false })).to.equal(
        '<someelem someattribute="something">hello</someelem>'
      );
    });

it('-648-should keep camelCase for new nodes', function () {
      var str = '<g><someElem someAttribute="something">hello</someElem></g>';
      expect(dom(str, { xml: true })).to.equal(
        '<someElem someAttribute="something">hello</someElem>'
      );
    });

it('-649-should maintain the parsing options of distinct contexts independently', function () {
      var str = '<g><someElem someAttribute="something">hello</someElem></g>';
      var $ = cheerio.load('', { xml: false });

      expect($(str).html()).to.equal(
        '<someelem someattribute="something">hello</someelem>'
      );
    });
  });
});
