const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Overriding DNS for SRV resolution (fixes querySrv ECONNREFUSED)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');

dotenv.config();

const makeAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'tickets'
        });
        console.log('Connected to MongoDB');

        const user = await User.findOneAndUpdate(
            { email: email },
            { role: 'admin' },
            { new: true }
        );

        if (user) {
            console.log(`Success! User ${user.name} (${user.email}) is now an admin.`);
        } else {
            console.log(`User with email ${email} not found.`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email address: node makeAdmin.js <email>');
    process.exit(1);
}

makeAdmin(email);
