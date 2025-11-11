const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

    await mongoose.connect(url);
    console.log('Conectado ao MongoDB Atlas');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
