// Controlador para libros
const Book = require('../models/Book');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Controlador para crear un libro
exports.createBook = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { title, author, isbn, release_date } = req.body;

  // Validar los campos obligatorios
  if (!title || !author || !isbn || !release_date) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar y decodificar el token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secreto');

    // Validar que no haya un libro con el mismo isbn
    const existingBook = await Book.findOne({ where: { isbn: req.body.isbn } });
    if (existingBook) {
      return res.status(400).json({ error: 'Ya existe un libro con el mismo ISBN' });
    }

    // Crear el libro con el ID del usuario autenticado
    const book = await Book.create({ ...req.body, users_id: decodedToken.id });
    return res.status(201).json(book.id);

  } catch (error) {
    console.error('Error en createBook:', error);
    return res.status(401).json({ error: 'Token inválido o error al crear el libro' });
  }
};


// Controlador para obtener todos los libros y el usuario que los creó
exports.getBooks = async (req, res) => {
  try {
    // Obtener todos los libros con el usuario asociado
    const books = await Book.findAll({ include: { model: User, as: 'user' } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contolador para borrar un libro
exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  // Verificar si el usuario está autenticado
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  try {
    // Buscar el libro por ID
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    await book.destroy();
    return res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};