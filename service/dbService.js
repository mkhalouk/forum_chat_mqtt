const mongoose = require('mongoose');

async function connectToDb() {
  try {
    const uri = process.env.DB_URI;
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to mongodb");
  } catch (err) {
    console.error(err); 
  }
}

module.exports = { connectToDb };
