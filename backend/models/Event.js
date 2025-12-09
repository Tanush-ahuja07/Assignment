const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Event = sequelize.define('Event', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  location: DataTypes.STRING,
  date: { type: DataTypes.DATE, allowNull: false },
  total_seats: { type: DataTypes.INTEGER, allowNull: false },
  available_seats: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  img: DataTypes.STRING,
  created_by: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'events', timestamps: false });

module.exports = Event;
