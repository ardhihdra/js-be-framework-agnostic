const { DataTypes } = require('sequelize');
const { sequelize } = require("../db");

const UserModel = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
});


(() => {
  sequelize.sync({ force: false })
    .then(() => {
      console.log(`${UserModel.getTableName()} created successfully`);
    })
    .catch((error) => {
      console.error(`Error creating table ${UserModel.getTableName()}:`, error);
    });
})();

module.exports = UserModel;
