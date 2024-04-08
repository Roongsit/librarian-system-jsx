import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function EditBook() {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");

  const [bookID, setBookID] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [bookCount, setBookCount] = useState("");
  const [bookImg, setBookImg] = useState(null);
  const [newBookImg, setNewBookImg] = useState(null);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    fetchBookAndCategories(id); // Fetch book and category data
  }, [id]);

  const fetchBookAndCategories = async (bookID) => {
    getBookDetails(bookID);
    getCategories();
  };


  const getCategories = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API + "/get_category");
      setCategoryList(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getBookDetails = async (bookID) => {
    try {
      const response = await axios.get(import.meta.env.VITE_API + `/get_book/${bookID}`);
      if (response.data) {
        // Assume the response has the book data
        setBookID(response.data.bookID);
        setBookName(response.data.bookName);
        setBookCategory(response.data.bookCategory);
        setBookCount(response.data.bookCount);
        setBookImg(response.data.bookImg);
      } else {
        Swal.fire("No such book found!", "", "warning");
      }
    } catch (error) {
      console.error("Error getting book details:", error);
      Swal.fire("Error getting book details", error.message, "error");
    }
  };

  const updateBook = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bookID", bookID);
    formData.append("bookName", bookName);
    formData.append("bookCategory", bookCategory);
    formData.append("bookCount", bookCount);
    // Append new image if it has been selected
    if (newBookImg) {
      formData.append("bookImg", newBookImg);
    }

    try {
      const response = await axios.put(import.meta.env.VITE_API + `/update_book/${bookID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Update Successful!", "Book details have been updated.", "success");
    } catch (error) {
      console.log(error)
      console.error("Error updating book:", error);
      Swal.fire("Update Failed!", error.response?.data?.message || "An error occurred while updating the book.", "error");
    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center py-12 bg-gray-100 min-h-screen">
        <div className="max-w-md w-full space-y-8 bg-white shadow rounded px-10 pt-6 pb-8 mb-4">
          {id ? (
            <form onSubmit={updateBook} className="space-y-6">
              <div>
                <label
                  htmlFor="book-id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Book ID
                </label>
                <input
                  id="book-id"
                  name="bookID"
                  type="text"
                  autoComplete="off"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={bookID}
                  onChange={(e) => setBookID(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="book-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Book Name
                </label>
                <input
                  id="book-name"
                  name="bookName"
                  type="text"
                  autoComplete="off"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="book-category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Book Category
                </label>
                <select
                  id="book-category"
                  name="bookCategory"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={bookCategory}
                  onChange={(e) => setBookCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categoryList.map((category) => (
                    <option key={category.categoryID} value={category.name}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="book-count"
                  className="block text-sm font-medium text-gray-700"
                >
                  Book Count
                </label>
                <input
                  id="book-count"
                  name="bookCount"
                  type="number"
                  autoComplete="off"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Book Count"
                  value={bookCount}
                  onChange={(e) => setBookCount(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="book-img"
                  className="block text-sm font-medium text-gray-700"
                >
                  Book Image
                </label>
                <input
                  id="book-img"
                  name="bookImg"
                  type="file"
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setNewBookImg(e.target.files[0])}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Book
                </button>
              </div>
            </form>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default EditBook;
