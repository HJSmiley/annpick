const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  user_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'users'
});

module.exports = User;
