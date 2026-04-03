import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.route.js';
import userRoutes from '#routes/user.route.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

app.get('/', (req, res) => {
  logger.info('Hello from acquisitions');
  res.status(200).send('Hello from acquisitions');
});

app.get('/health', (req, res) => {
  logger.info('Health check');
  res.status(200).json({
    message: 'OK',
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  logger.info('API endpoint');
  res.status(200).json({
    message: 'Acquisitions API is running!',
    uptime: process.uptime(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((err, req, res, _next) => {
  logger.error('Error: ', err);
  res.status(500).json({
    message: 'Internal server error',
  });
});

export default app;
