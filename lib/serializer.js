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

/**
 * Expose `PgSerializer`.
 */
module.exports = PgSerializer;

/**
 *
 * @constructor
 */
function PgSerializer() {
  this.paramType = 2;
}

const proto = PgSerializer.prototype;
proto.constructor = PgSerializer;

proto.isReserved = function(ctx, s) {
  return reservedWords.indexOf(String(s).toLowerCase()) >= 0;
};

proto.serialize = function(ctx, type, o, defFn) {
  switch (type) {
    case 'select_query':
      return this.serializeSelect(ctx, o, defFn);
  }
};

proto.serializeSelect = function(ctx, o, defFn) {
  var out = defFn(ctx, o);
  const limit = o.limit || 0;
  const offset = Math.max((o.offset || 0), 0);
  if (limit)
    out += '\nLIMIT ' + limit;
  if (offset)
    out += (!limit ? '\n' : ' ') + 'OFFSET ' + offset;
  return out;
};

