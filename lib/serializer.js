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
    if (o.expression && o.operatorType === 'in')
      return o.value1.substring(0, 1) === '$' ?
          o.expression + ' = ANY(' + o.value1 + ')'
          : defFn(ctx, o);
    if (o.expression && o.operatorType === 'notIn')
      return o.value1.substring(0, 1) === '$' ?
          o.expression + ' not = ANY(' + o.value1 + ')'
          : defFn(ctx, o);
    return defFn(ctx, o);
  };

}

/**
 * Expose `PgSerializer`.
 */
module.exports = PgSerializer;