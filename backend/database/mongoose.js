const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/hungry-explorers-api', {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  autoIndex: true
});
