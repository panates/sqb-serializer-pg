/* sqb-serializer-pg
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/sqb-serializer-pg/
 */
/**
 * Module variables.
 * @private
 */
const reservedWords = ['comment'];

class PgSerializer {

  /**
   *
   * @constructor
   */
  constructor() {
    this.paramType = 2;
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  isReserved(ctx, s) {
    return reservedWords.indexOf(String(s).toLowerCase()) >= 0;
  };

  serialize(ctx, type, o, defFn) {
    switch (type) {
      case 'select_query':
        return this.serializeSelect(ctx, o, defFn);
      case 'operator':
        return this.serializeOperator(ctx, o, defFn);
    }
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  serializeSelect(ctx, o, defFn) {
    let out = defFn(ctx, o);
    const limit = o.limit || 0;
    const offset = Math.max((o.offset || 0), 0);
    if (limit)
      out += '\nLIMIT ' + limit;
    if (offset)
      out += (!limit ? '\n' : ' ') + 'OFFSET ' + offset;
    return out;
  }

  // noinspection JSMethodCanBeStatic, JSUnusedGlobalSymbols
  serializeOperator(ctx, o, defFn) {
    if (o.expression) {
      if (o.value1.startsWith('(')) {
        if (['eq', 'in'].indexOf(o.operatorType) >= 0)
          return o.expression + ' in ' + o.value1;
        if (['ne', 'notIn'].indexOf(o.operatorType) >= 0)
          return o.expression + ' not in ' + o.value1;
      }
      const isParam = o.value1.substring(0, 1) === '$';
      if (isParam) {
        if (o.operatorType === 'in')
          return o.expression + ' = ANY(' + o.value1 + ')';
        if (o.operatorType === 'notIn')
          return o.expression + ' not = ANY(' + o.value1 + ')';
      }
    }
    return defFn();
  };

}

/**
 * Expose `PgSerializer`.
 */
module.exports = PgSerializer;