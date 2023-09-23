const { DataTypes } = require('sequelize');
const { sequelize } = require("../db");
const UserModel = require('./user.model');

const InvitationModel = sequelize.define('Invitation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  bride: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brideImages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  coupleImages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  user: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'id'
    }
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  giftAccountAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  giftAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  groom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  groomImages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
});


(() => {
  sequelize.sync({ force: false })
    .then(() => {
      console.log(`${InvitationModel.getTableName()} created successfully`);
    })
    .catch((error) => {
      console.error(`Error creating table ${InvitationModel.getTableName()}:`, error);
    });
})();

module.exports = InvitationModel;
