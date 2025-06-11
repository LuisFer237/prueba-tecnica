import { parseJwt } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Obtener info del usuario autenticado
export async function getUserInfo(token) {
    // Obtener el payload del token JWT
    const payload = parseJwt(token);
    if (!payload?.id) throw new Error('Token inválido');
    const res = await fetch(`${API_URL}/users/${payload.id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('No autorizado');
    return await res.json();
}

// Obtener todos los usuarios
export async function getAllUsers(token) {
    const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('No autorizado');
    return await res.json();
}

// Eliminar un usuario por ID
export async function deleteUserById(token, userId) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 400) {
        const data = await res.json();
        if (data.error === 'No se puede eliminar el usuario porque tiene libros asociados') {
            throw new Error('USER_HAS_BOOKS');
        }
        throw new Error(data.error || 'Error desconocido');
    }
    if (!res.ok) throw new Error('No autorizado');
    return await res.json();
}

// Editar un usuario por ID
export async function updateUserById(token, userId, data) {
    const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (res.status === 400) {
        const data = await res.json();
        if (data.error === 'El correo ya está registrado') {
            throw new Error('EMAIL_EXISTS');
        }
        throw new Error(data.error || 'Error desconocido');
    }
    if (!res.ok) throw new Error('No autorizado');
    return await res.json();
}