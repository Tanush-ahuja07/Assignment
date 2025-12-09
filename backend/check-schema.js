require('dotenv').config();
const sequelize = require('./models');
const Event = require('./models/Event');
const User = require('./models/User');

async function checkAndUpdateSchema() {
  try {
    // Sync models with force: false (won't drop existing tables)
    await sequelize.sync({ alter: true });
    console.log('Database schema synced successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error syncing database:', err);
    process.exit(1);
  }
}

checkAndUpdateSchema();
