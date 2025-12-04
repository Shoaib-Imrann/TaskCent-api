import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setDefaultResultOrder } from 'dns';
import sequelize from './config/sequelize.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();
setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 8000;

// Trust proxy for Railway
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', apiLimiter, taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend up and ready' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();