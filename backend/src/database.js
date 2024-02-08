const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI  
  ? process.env.MONGODB_URI 
  : 'mongodb://localhost/mernstack';

mongoose.connect(URI, {
  retryWrites: true,
  w: 'majority',
  authSource: 'admin'
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('DB is connected');
});