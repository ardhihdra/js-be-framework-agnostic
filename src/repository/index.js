const { FirestoreRepository } = require('./firestore.repository');
const { PostgresRepository } = require('./pg-sequelize/postgres.repository');

module.exports = {
  // implementation
  FirestoreRepository,
  PostgresRepository
}