require('dotenv').config();
const express = require('express');
const sequelize = require('./models');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Set up model associations
User.hasMany(Event, { foreignKey: 'created_by', as: 'createdEvents' });
Event.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const generateToken = (user) => jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });

const ensureDefaultAdmin = async () => {
  const { ADMIN_DEFAULT_EMAIL, ADMIN_DEFAULT_PASSWORD } = process.env;
  if (!ADMIN_DEFAULT_EMAIL || !ADMIN_DEFAULT_PASSWORD) return;

  const existing = await User.findOne({ where: { email: ADMIN_DEFAULT_EMAIL } });
  if (existing) return;

  const password_hash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 10);
  await User.create({ email: ADMIN_DEFAULT_EMAIL, password_hash, role: 'admin', name: 'Admin' });
  console.log('Seeded default admin user');
};


// ------------------------- AUTH -------------------------
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash, role: 'user' });

    res.status(201).json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: generateToken(user), role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/auth/me', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'role'] });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ------------------------- ADMIN: USERS -------------------------
app.get('/users', authenticate, requireAdmin, async (_req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'created_at'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list users' });
  }
});

app.put('/users/:id/role', authenticate, requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!role || !['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  try {
    const [updated] = await User.update({ role }, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});


// ------------------------- GET EVENTS -------------------------
app.get('/events', async (req, res) => {
  try {
    const { search, location, date } = req.query;

    const where = {};

    if (search) where.title = { [sequelize.Op.like]: `%${search}%` };
    if (location) where.location = location;
    if (date) where.date = sequelize.where(sequelize.fn('DATE', sequelize.col('date')), date);

    const events = await Event.findAll({
      where,
      order: [['date', 'ASC']],
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
        as: 'creator'
      }]
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list events' });
  }
});


// GET USER'S CREATED EVENTS
app.get('/events/user/:userId', authenticate, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { created_by: req.params.userId },
      order: [['date', 'ASC']],
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
        as: 'creator'
      }]
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user events' });
  }
});

// ------------------------- GET EVENT BY ID -------------------------
app.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'name', 'email'],
        as: 'creator'
      }]
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});


// ------------------------- CREATE EVENT -------------------------
app.post('/events', authenticate, requireAdmin, async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      created_by: req.user.id,
      available_seats: req.body.available_seats ?? req.body.total_seats
    });
    res.status(201).json({ id: event.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});


// ------------------------- UPDATE EVENT -------------------------
app.put('/events/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const [updated] = await Event.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ error: 'Event not found' });

    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});


// ------------------------- DELETE EVENT -------------------------
app.delete('/events/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const deleted = await Event.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) return res.status(404).json({ error: 'Event not found' });

    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});


// ------------------------- CREATE BOOKING WITH TRANSACTION -------------------------
app.post('/bookings', authenticate, async (req, res) => {
  const { event_id, name, email, mobile, quantity } = req.body;

  const t = await sequelize.transaction();

  try {
    const event = await Event.findByPk(event_id, { transaction: t });
    if (!event) {
      await t.rollback();
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.available_seats < quantity) {
      await t.rollback();
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    await event.update(
      { available_seats: event.available_seats - quantity },
      { transaction: t }
    );

    const totalAmount = event.price * quantity;

    const booking = await Booking.create({
      event_id,
      name,
      email,
      mobile,
      quantity,
      total_amount: totalAmount,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ id: booking.id, total_amount: totalAmount });

  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: 'Failed to create booking' });
  }
});


// ------------------------- 404 -------------------------
app.use((req, res) => res.status(404).json({ error: 'Not found' }));


// ------------------------- START SERVER -------------------------
const port = process.env.PORT || 3000;

sequelize.sync().then(async () => {
  await ensureDefaultAdmin();
  app.listen(port, () => console.log(`API running on ${port}`));
});
