/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id');
      table.string('first_name', 30).notNullable();
      table.string('last_name', 30).notNullable();
      table.string('email', 250).notNullable();
      table.string('password', 250).notNullable();
      table.timestamps(true, true);
    })
    .createTable('tokens', (table) => {
      table.increments();
      table.string('refresh_token', 1024).notNullable();
      table.string('expires_in', 64).notNullable();
      table.timestamps(true, true);
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users').dropTableIfExists('tokens');
};
