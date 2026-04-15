const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/v1/auth.routes');
const tasksRoutes = require('./routes/v1/tasks.routes');
const setupSwagger = require('./docs/swagger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

setupSwagger(app);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Service healthy'
    }
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', tasksRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(status).json({
    success: false,
    error: {
      code,
      message: err.message || 'Something went wrong',
      details: err.details || undefined
    }
  });
});

module.exports = app;
