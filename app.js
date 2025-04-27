import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import Contact from './db/models/contacts.js';
import User from './db/models/users.js';
import authRouter from './routes/authRouter.js';
import contactsRouter from './routes/contactsRouter.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

const syncDb = async () => {
  console.log('Connecting to database...');
  try {
    await Contact.sync({ alter: true });
    await User.sync({ alter: true });
    console.log('Tables synced!');
  } catch (error) {
    console.error('DB sync error:', error.message);
  }
};

syncDb();

app.listen(3000, () => {
  console.log('Server is running. Use our API on port: 3000');
});
