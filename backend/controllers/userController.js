// Controlador para usuarios
const User = require('../models/User');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');


// Controlador para obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    // Excluir el campo password de cada usuario
    const usersWithoutPassword = users.map(user => {
      const userObj = user.toJSON();
      delete userObj.password;
      return userObj;
    });

    res.json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener un usuario por ID
exports.getUserById = async (req, res) => {

  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userObj = user.toJSON();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para eliminar un usuario por ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el usuario tiene libros asociados
    const booksCount = await Book.count({ where: { users_id: id } });
    if (booksCount > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el usuario porque tiene libros asociados' });
    }

    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controlador para actualizar un usuario por ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, name, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el nuevo correo ya existe en otro usuario
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }
    }

    // Actualizar solo los campos proporcionados
    if (email) user.email = email;
    if (name) user.name = name;
    if (password) user.password = password;

    // Hashear la contraseña si se proporciona
    if (password) {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}