const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255)
  },
  password: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
