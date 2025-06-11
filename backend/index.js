const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./db');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');

sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
