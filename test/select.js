/* eslint-disable */

const assert = require('assert'),
    sqb = require('sqb');

sqb.use(require('../'));

var query;
var result;

describe('PostreSQL select queries', function() {

    it('should serialize "limit"', function(done) {
      query = sqb.select().from('table1').as('t1').limit(10);
      result = query.generate({
        dialect: 'pg',
        prettyPrint: 0
      });
      assert.equal(result.sql, 'select * from table1 LIMIT 10');
      done();
    });

    it('should serialize "limit" pretty print', function(done) {
      query = sqb.select().from('table1').as('t1').limit(10);
      result = query.generate({
        dialect: 'pg',
        prettyPrint: 1
      });
      assert.equal(result.sql,
          'select * from table1\n' +
          'LIMIT 10');
      done();
    });

    it('should serialize "limit/offset"', function(done) {
      query = sqb.select()
          .from('table1')
          .offset(4)
          .limit(10);
      result = query.generate({
        dialect: 'pg',
        prettyPrint: 0
      });
      assert.equal(result.sql, 'select * from table1 LIMIT 10 OFFSET 4');
      done();
    });

    it('should serialize "limit/offset" pretty print', function(done) {
      query = sqb.select()
          .from('table1')
          .offset(4)
          .limit(10);
      result = query.generate({
        dialect: 'pg',
        prettyPrint: 1
      });
      assert.equal(result.sql,
          'select * from table1\n' +
          'LIMIT 10 OFFSET 4');
      done();
    });

  it('Should serialize params', function(done) {
    query = sqb.select().from('table1').where(['ID', /ID/]);
    result = query.generate({
      dialect: 'pg',
      prettyPrint: 0
    }, {ID: 5});
    assert.equal(result.sql, 'select * from table1 where ID = $1');
    assert.deepEqual(result.values, [5]);
    done();
  });

});

