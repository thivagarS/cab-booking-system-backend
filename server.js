require('./config/keys');

const express = require("express");
const bodyParser = require('body-parser')
// connect to DB
require('./db');

// routes
const authRoutes = require('./routes/auth');

const PORT = 8080 || process.env.PORT;
const app = express();

app.use(bodyParser.json());

// Auth Routes
app.use('/auth', authRoutes);

// Error Handler
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

app.listen(PORT, () => {
    console.log(`Application started listening on port ${PORT}`);

})

