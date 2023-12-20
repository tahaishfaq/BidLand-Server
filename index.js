
  const express = require('express');
  const mongoose = require('mongoose');
  const authRoutes = require('./routes/userRoute');
  const propertyRoutes = require('./routes/propertyRoute');
  const biddingRoutes = require('./routes/biddingRoutes')
  const orderRoutes = require('./routes/orderRoute');

  const cors = require('cors');
  const app = express();
  app.use(cors());
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json());
  
  // Connect to MongoDB
  //mongodb://bidland:123@ac-jkcaupi-shard-00-00.te2zh0j.mongodb.net:27017,ac-jkcaupi-shard-00-01.te2zh0j.mongodb.net:27017,ac-jkcaupi-shard-00-02.te2zh0j.mongodb.net:27017/?ssl=true&replicaSet=atlas-7mzh5y-shard-0&authSource=admin&retryWrites=true&w=majority
  // mongodb+srv://bidland:123@user.te2zh0j.mongodb.net/?retryWrites=true&w=majority

  mongoose.connect('mongodb://bidland:123@ac-jkcaupi-shard-00-00.te2zh0j.mongodb.net:27017,ac-jkcaupi-shard-00-01.te2zh0j.mongodb.net:27017,ac-jkcaupi-shard-00-02.te2zh0j.mongodb.net:27017/?ssl=true&replicaSet=atlas-7mzh5y-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed', err));
  
  app.use('/auth', authRoutes);
  app.use('/property', propertyRoutes);
  app.use('/bidding', biddingRoutes);
  app.use('/orders', orderRoutes);
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  