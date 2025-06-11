"use client";

import { useEffect, useState, useCallback } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getAllBooks } from "../../../api/book";

export default function BooksPage() {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const books = await getAllBooks(token);
      setData(
        books.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          release_date: book.release_date,
          user_name: book.user ? book.user.name : "-",
        }))
      );
    } catch (error) {
      console.error("Error al obtener los libros:", error);
      setData([]);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-auto py-5 px-2 md:px-8">
      <DataTable columns={columns} data={data} meta={{ refetch: fetchData }} />
    </div>
  );
}
