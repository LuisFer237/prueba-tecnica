const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función para obtener todos los libros
export async function getAllBooks(token) {
  try {
    const res = await fetch(`${API_URL}/books`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Error al obtener libros");
    }
    return data;
  } catch (error) {
    return { error: error.message || "Error de red al obtener libros" };
  }
}

// Función para crear un nuevo libro
export async function createBook(token, book) {
  try {
    const res = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(book),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data?.error || "Error al crear libro" };
    }
    return data;
  } catch (error) {
    return { error: error.message || "Error de red al crear libro" };
  }
}

// Función para eliminar un libro por ID
export async function deleteBookById(token, id) {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Error al eliminar libro");
    }
    return data;
  } catch (error) {
    return { error: error.message || "Error de red al eliminar libro" };
  }
}

// Función para actualizar un libro por ID
export async function updateBookById(token, id, book) {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(book),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data?.error || "Error al actualizar libro" };
    }
    return data;
  } catch (error) {
    return { error: error.message || "Error de red al actualizar libro" };
  }
}
