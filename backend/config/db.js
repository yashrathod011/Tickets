const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Overriding DNS for SRV resolution (fixes querySrv ECONNREFUSED in certain environments)
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const connectDB = async () => {
    try {
        console.log('Using MONGO_URI from .env');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'tickets'
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
