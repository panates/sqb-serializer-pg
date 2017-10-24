/* eslint-disable */

const assert = require('assert'),
    sqb = require('sqb');

sqb.use(require('../'));

describe('PostreSQL select queries', function() {

    it('should serialize "limit"', function(done) {
      var query = sqb.select().from('table1').as('t1').limit(10);
      var result = query.generate({
        dialect: 'pg'
      });
      assert.equal(result.sql, 'select * from table1 LIMIT 10');
      done();
    });

    it('should serialize "limit" pretty print', function(done) {
      var query = sqb.select().from('table1').as('t1').limit(10);
      var result = query.generate({
        dialect: 'pg',
        prettyPrint: true
      });
      assert.equal(result.sql,
          'select * from table1\n' +
          'LIMIT 10');
      done();
    });

    it('should serialize "limit/offset"', function(done) {
      var query = sqb.select()
          .from('table1')
          .offset(4)
          .limit(10);
      var result = query.generate({
        dialect: 'pg'
      });
      assert.equal(result.sql, 'select * from table1 LIMIT 10 OFFSET 4');
      done();
    });

    it('should serialize "limit/offset" pretty print', function(done) {
      var query = sqb.select()
          .from('table1')
          .offset(4)
          .limit(10);
      var result = query.generate({
        dialect: 'pg',
        prettyPrint: true
      });
      assert.equal(result.sql,
          'select * from table1\n' +
          'LIMIT 10 OFFSET 4');
      done();
    });

  it('Should serialize params', function(done) {
    var query = sqb.select().from('table1').where(['ID', /ID/]);
    var result = query.generate({
      dialect: 'pg'
    }, {ID: 5});
    assert.equal(result.sql, 'select * from table1 where ID = $1');
    assert.deepEqual(result.values, [5]);
    done();
  });

});

