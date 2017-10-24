/* sqb-serializer-pg
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/sqb-serializer-pg/
 */

/* Internal module dependencies. */
const PgSerializer = require('./serializer');

module.exports = {
  createSerializer: function(config) {
    if (config.dialect === 'pg' || config.dialect === 'postgres') {
      return new PgSerializer(config);
    }
  }
};
