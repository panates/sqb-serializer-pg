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

const proto = PgSerializer.prototype = {};
proto.constructor = PgSerializer;

// noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
proto.isReserved = function(s) {
  return reservedWords.indexOf(String(s).toLowerCase()) >= 0;
};

//noinspection JSUnusedGlobalSymbols,JSMethodCanBeStatic
proto.serializeSelect = function(instance, obj, inf) {
  var out = instance.serializeSelect(obj, inf);
  const limit = instance.query._limit || 0;
  const offset = Math.max((obj._offset || 0), 0);
  if (limit)
    out += '\nLIMIT ' + limit;
  if (offset)
    out += (!limit ? '\n' : ' ') + 'OFFSET ' + offset;
  return out;
};

