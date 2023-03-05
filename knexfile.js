// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '178.128.109.9',
      port: 3306,
      user: 'test01',
      password: 'PlsDoNotShareThePass123@',
      database: 'entrance_test',
    },
  },
};
// module.exports = {
//   development: {
//     client: 'mysql',
//     connection: {
//       host: process.env.DB_HOST,
//       port: 3306,
//       user: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//     },
//   },
// };
