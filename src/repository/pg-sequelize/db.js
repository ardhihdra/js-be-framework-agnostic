const { Sequelize } = require('sequelize');
const config = require('../../config/config');

const sequelize = new Sequelize(
  'undangan3d',
  config.POSTGRES_USERNAME,
  config.POSTGRES_PASSWORD,
  {
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    dialect: 'postgres'
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})()

module.exports = {
  sequelize
}