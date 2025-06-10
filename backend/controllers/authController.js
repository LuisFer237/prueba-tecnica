const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validar los campos obligatorios
    if (!email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Buscar el usuario por email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Validar la contraseña
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '24h' }
        );

        // Retornar el token
        return res.json({
            token
        });
    } catch (error) {
        return res.status(500).json({ error: 'Hubo un error al iniciar sesión' });
    }
};

exports.register = async (req, res) => {
    const { email, name, password } = req.body;

    // Validar los campos obligatorios
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    // Validar que el usuario no exista
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    try {
        const newUser = await User.create({
            email,
            name,
            password: hashedPassword
        })

        // Operación exitosa, retornar true
        return res.json(true);
    } catch (error) {
        return res.status(500).json({ error: 'Hubo un error al registrar el usuario' });
    }

};
