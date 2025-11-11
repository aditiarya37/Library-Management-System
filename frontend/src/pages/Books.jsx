import React, { useState, useEffect } from "react";
import { bookAPI, borrowAPI } from "../services/api";
import { useAuth } from "../utils/AuthContext";
import Navbar from "../components/Navbar";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookAPI.getAll();
      setBooks(response.data);
    } catch (err) {
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await borrowAPI.borrow(bookId);
      setSuccessMsg("Book borrowed successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to borrow book");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Loading books...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Available Books</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-1">by {book.author}</p>
              <p className="text-gray-500 text-sm mb-2">ISBN: {book.isbn}</p>
              <p className="text-blue-600 font-semibold mb-4">
                Available: {book.availableCopies} copies
              </p>

              {user?.role === "USER" && (
                <button
                  onClick={() => handleBorrow(book.id)}
                  disabled={book.availableCopies === 0}
                  className={`w-full py-2 rounded ${
                    book.availableCopies > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {book.availableCopies > 0 ? "Borrow" : "Not Available"}
                </button>
              )}
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No books available
          </div>
        )}
      </div>
    </>
  );
};

export default Books;
