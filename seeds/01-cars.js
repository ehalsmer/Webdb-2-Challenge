
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('cars').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('cars').insert([
        { vin: '3VWSE29M82M028637', make: 'Volkswagen', model: 'Jetta', mileage: 28769, transmissionType: 'Automatic', titleStatus: 'clean'},
        { vin: 'JH4DA1745GS002661', make: 'Acura', model: 'Integra', mileage: 76235, transmissionType: 'Manual', titleStatus: 'salvage'},
        { vin: '4S3BK6354S6355265', make: 'Subaru', model: 'Legacy', mileage: 1254, transmissionType: 'Automatic', titleStatus: 'clean'},
        { vin: '4T4BF1FK4CR236137', make: 'Toyota', model: 'Camry', mileage: 23462, transmissionType: 'Automatic', titleStatus: 'rebuilt'},
        { vin: 'JH4NA1260NT000255', make: 'Acura', model: 'NSX', mileage: 120593, transmissionType: 'Manual', titleStatus: 'clean'},
      ]);
    });
};
