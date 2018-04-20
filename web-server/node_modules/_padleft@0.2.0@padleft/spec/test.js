const should = require('chai').should();
const expect = require('chai').expect;

require('../padleft');

describe('.padLeft testing', function () {
  
  it("Should add chars on string's left until the reach the size", function () {
    '.2'.padLeft(4, 0).should.eql('00.2');
    '.2'.padLeft(4, '0').should.eql('00.2');
    'is slow'.padLeft(14, 'my car ').should.eql('my car is slow');
  });
});


describe('.padRigth testing', function () {
  
  it("Should add chars on string's rigth until the reach the size", function () {
    '2.0'.padRight(5, 0).should.eql('2.000');
    '2.0'.padRight(5, '0').should.eql('2.000');
    'slow'.padRight(14, ' my car is').should.eql('slow my car is');
  });
});
