 /*jshint esversion: 6 */

exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('papers', (table) => {
      table.string('publisher');
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('papers', (table) => {
      table.dropColumn('publisher');
    })
  ]);
};
