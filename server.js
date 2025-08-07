const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
const userRoutes = require('./routes/userInfoRoutes');
const businessRoutes = require('./routes/businessInfoRoutes');
const app = express();
app.use(express.json());


// other middleware like bodyParser, routes, etc.
//serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})*/

app.use('/api/user', userRoutes);
app.use('/api/business', businessRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Starting the server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running. Swagger docs at /api-docs');
});
