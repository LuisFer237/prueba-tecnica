export async function login({ email, password }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al iniciar sesión");
    }

    return res.json();
}

// Función para decodificar el JWT
export function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

// Registrar un nuevo usuario
export async function registerUser(userData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    let data = null;
    try {
        data = await res.json();
    } catch (e) {
        data = null;
    }
    if (!res.ok) {
        // Si el backend manda un error específico, pásalo
        if (data && data.error) {
            return { error: data.error };
        }
        throw new Error('Error al registrar usuario');
    }
    // Si el backend responde con { error: ... } aunque sea 200
    if (data && data.error) {
        return { error: data.error };
    }
    return data;
}
