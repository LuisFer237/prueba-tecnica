// Controlador para libros
const Book = require('../models/Book');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Controlador para crear un libro
exports.createBook = async (req, res) => {
  const { title, author, isbn, release_date } = req.body;

  // Validar los campos obligatorios
  if (!title || !author || !isbn || !release_date) {
    console.error('Error en createBook: Todos los campos son obligatorios');
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Validar que no haya un libro con el mismo isbn
    const existingBook = await Book.findOne({ where: { isbn: req.body.isbn } });
    if (existingBook) {
      console.error('Error en createBook: Ya existe un libro con el mismo ISBN');
      return res.status(400).json({ error: 'Ya existe un libro con el mismo ISBN' });
    }

    // Crear el libro con el ID del usuario autenticado
    const book = await Book.create({ ...req.body, users_id: req.user.id });
    return res.status(201).json(book.id);

  } catch (error) {
    console.error('Error en createBook:', error);
    return res.status(500).json({ error: 'Error al crear el libro' });
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

// Controlador para actualizar un libro
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, release_date } = req.body;
  try {
    // Buscar el libro por ID
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    const existingBook = await Book.findOne({ where: { isbn } });
    if (existingBook && existingBook.id !== book.id) {
      return res.status(400).json({ error: 'Ya existe un libro con el mismo ISBN' });
    }
    // Actualizar solo los campos proporcionados
    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (release_date) book.release_date = release_date;
    await book.save();
    return res.json({ message: 'Libro actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};