// Función para iniciar sesión
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
        throw new Error(errorData.error || errorData.message || "Error al iniciar sesión");
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
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) {
            return { error: data?.error || "Error al registrar usuario" };
        }
        return data;
    } catch (error) {
        return { error: error.message || "Error de red al registrar usuario" };
    }
}
