const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });

setTimeout(() => {
    console.log('Timeout reached');
    process.exit(1);
}, 10000);
