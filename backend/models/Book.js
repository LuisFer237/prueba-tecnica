const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(500)
  },
  author: {
    type: DataTypes.STRING(255)
  },
  isbn: {
    type: DataTypes.STRING(255),
    unique: true
  },
  release_date: {
    type: DataTypes.DATE
  },
  users_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'books',
  timestamps: false
});

Book.belongsTo(User, { foreignKey: 'users_id', as: 'user' });
User.hasMany(Book, { foreignKey: 'users_id', as: 'books' });

module.exports = Book;
