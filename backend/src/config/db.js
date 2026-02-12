const mongoose = require('mongoose');

async function connectDB(mongoUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    autoIndex: true
  });
}

module.exports = { connectDB };

