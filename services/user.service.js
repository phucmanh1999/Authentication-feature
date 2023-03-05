const db = require('../knex/knex');
const bcrypt = require('bcrypt');

const getAll = async () => {
  return db('users').select();
};
const findByEmail = async (email) => {
  return db('users').select().where({ email });
};
const findById = async (id) => {
  return db('users').select().where({ id });
};

const createUser = async (obj) => {
  return db('users').insert(obj);
};

const isValidPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};

const saveRefreshToken = async (userId, token, refreshTokenExpiresIn) => {
  db('tokens')
    .insert({
      user_id: userId,
      expires_in: refreshTokenExpiresIn,
      refresh_token: token,
    })
    .then(([res]) => {
      return res;
    });
};

const signOut = async (id) => {
  return db('tokens').where('user_id', id).del();
};

module.exports = {
  getAll,
  findByEmail,
  createUser,
  isValidPassword,
  findById,
  saveRefreshToken,
  signOut,
};
