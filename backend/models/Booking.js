const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Event = require('./Event');

const Booking = sequelize.define('Booking', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  mobile: DataTypes.STRING,
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  total_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  booking_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.ENUM('confirmed','cancelled'), defaultValue: 'confirmed' },
}, { tableName: 'bookings', timestamps: false });

Event.hasMany(Booking, { foreignKey: 'event_id' });
Booking.belongsTo(Event, { foreignKey: 'event_id' });

module.exports = Booking;
