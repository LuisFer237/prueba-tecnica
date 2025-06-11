// API para libros
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllBooks(token) {
  const res = await fetch(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener libros");
  return await res.json();
}

export async function createBook(token, book) {
  const res = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(book),
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  if (!res.ok) {
    if (data && data.error) {
      return { error: data.error };
    }
    throw new Error("Error al crear libro");
  }
  if (data && data.error) {
    return { error: data.error };
  }
  return data;
}

export async function deleteBookById(token, id) {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar libro");
  return await res.json();
}

export async function updateBookById(token, id, book) {
  const res = await fetch(`${API_URL}/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(book),
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  if (!res.ok) {
    if (data && data.error) {
      return { error: data.error };
    }
    throw new Error("Error al actualizar libro");
  }
  if (data && data.error) {
    return { error: data.error };
  }
  return data;
}
