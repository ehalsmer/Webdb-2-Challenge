
exports.up = function(knex) {
  return knex.schema.createTable('cars', tbl => {
      // critical info:
      //    VIN, make, model, mileage
      // also track:
      //    transmission type and status of title, but not always known (can be null)
      tbl.increments();
      tbl.string('vin', 17).unique().notNullable();
      tbl.string('make').notNullable();
      tbl.string('model').notNullable();
      tbl.integer('mileage').notNullable();
      tbl.string('transmissionType');
      tbl.string('titleStatus');
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cars');
};
