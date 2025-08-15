/**Now for the sake of modularity and avoiding redundancy and easy implimentation of jest testing etc
 * that is why i'm seperating this code from server but will call it in the server.js file.

 */
const cors = require('cors');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
require('dotenv').config();
const passport = require('passport');

// Load Swagger docs
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));

// Import routes
const userRoutes = require('./routes/userRoutes.js');
const businessRoutes = require('./routes/businessRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes.js');
const serviceRoutes = require('./routes/serviceRoutes.js');

// Passport config
require('./config/passport.js');

const app = express();
app.use(express.json());

//allow request from my local frontend
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://nnocj.github.io/richslice/','http://localhost:3000'], // replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));



// Initialize Passport for OAuth
app.use(passport.initialize());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);

module.exports = app;
