const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
require('dotenv').config();

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
const userRoutes = require('./routes/userRoutes.js');
const businessRoutes = require('./routes/businessRoutes');
const passport = require('passport');// the need to recall it here
require('./config/passport.js');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes.js');
const serviceRoutes = require('./routes/serviceRoutes.js');

const app = express();
app.use(express.json());

// ===== Initialize Passport for OAuth =====
app.use(passport.initialize());

// ===== Serve static files =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== API Routes =====
app.use('/api/user', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);

// ===== Start server =====
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running. Swagger docs at /api-docs');
});
