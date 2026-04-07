const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/theaters', require('./routes/theaters'));

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Tickets API is running...');
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'Connected to Tickets Backend', database: 'MongoDB' });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
