const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  // Use Google DNS to resolve MongoDB Atlas SRV records
  // (fixes issues where local/corporate DNS blocks MongoDB Atlas)
  dns.setServers(['8.8.8.8', '8.8.4.4']);

  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB Connected Successfully");
      return;
    } catch (error) {
      retries++;
      console.error(`MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`);
      if (retries < MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, retries), 10000);
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('All MongoDB connection attempts failed. Exiting.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
