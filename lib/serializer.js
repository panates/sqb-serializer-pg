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
      case 'comparison':
        return this.serializeComparison(ctx, o, defFn);
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
  serializeComparison(ctx, o, defFn) {
    if (typeof o.value === 'string') {
      if (o.value.startsWith('(')) {
        if (o.operatorType === 'eq')
          o.symbol = 'in';
        if (o.operatorType === 'ne')
          o.symbol = 'not in';
      } else {
        if (o.value.substring(0, 1) === '$') {
          if (o.operatorType === 'in') {
            o.symbol = '=';
            o.value = 'ANY(' + o.value + ')';
          }
          if (o.operatorType === 'notIn') {
            o.symbol = '!=';
            o.value = 'ANY(' + o.value + ')';
          }
        }
      }
    }
    return defFn.call(this, arguments);
  };

}

/**
 * Expose `PgSerializer`.
 */
module.exports = PgSerializer;