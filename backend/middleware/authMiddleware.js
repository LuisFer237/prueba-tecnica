const jwt = require('jsonwebtoken');

// Middleware para validar autenticación por token
module.exports = (req, res, next) => {

    // Obtener el token del encabezado Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        // Verificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};
