
  const express = require('express');
  const mongoose = require('mongoose');
  const authRoutes = require('./routes/userRoute');
  const propertyRoutes = require('./routes/propertyRoute');
  const cors = require('cors');
  const app = express();
  app.use(cors());
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json());
  
  // Connect to MongoDB
  mongoose.connect('mongodb+srv://bidland:123@user.te2zh0j.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed', err));
  
  app.use('/auth', authRoutes);
  app.use('/property', propertyRoutes);

  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  