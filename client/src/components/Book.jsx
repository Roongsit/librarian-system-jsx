import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import { AiOutlinePlus } from 'react-icons/ai';
import Swal from "sweetalert2";
import  axios from 'axios';

function Book() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getBooks();
  }, []);



  const getBooks = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API + '/get_book');
      setBooks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBook = async (bookID) => {
    try {
      await axios.delete(import.meta.env.VITE_API + `/delete_book/${bookID}`);
       const updatedBooks = books.filter((book) => book.bookID !== bookID);
      setBooks(updatedBooks);
      Swal.fire({
        title: "ลบหนังสือสำเร็จ!",
        icon: "success",
        confirmButtonText: "ยืนยัน",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "ลบหนังสือไม่สำเร็จ!",
        icon: "error",
        confirmButtonText: "ยืนยัน",
      });
    }
  };
  

  const filteredBooks = searchTerm.length === 0
      ? books : books.filter((book) => book.bookName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <>
        <Nav />
        <div className="font-sarabun container mx-auto px-4 py-8">
          <div className="flex  justify-start items-center mb-6">
            <Link
              to="/add_book"
              className="inline-block px-2  py-1 bg-transparent border-2 border-green-500 text-green-500 text-sm rounded-full transition-colors duration-700 transform hover:bg-green-500 hover:text-gray-100 focus:border-4 focus:border-green-300"
            >
              <AiOutlinePlus className="inline-block m-1" />  เพิ่มรายการหนังสือ  
            </Link>
            <Link
              to="/category"
              className="inline-block px-2  py-1 ml-3 bg-transparent border-2 border-green-500 text-green-500 text-sm rounded-full transition-colors duration-700 transform hover:bg-green-500 hover:text-gray-100 focus:border-4 focus:border-green-300"
            >
             <AiOutlinePlus className="inline-block m-1" /> เพิ่มหมวดหมู่
            </Link>
  
            <input
              type="text"
              className="  drop-shadow-md appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-auto"
              placeholder="ค้นหาชื่อหนังสือ..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ justifySelf: "end" }}
            />
          </div>
  
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 drop-shadow-2xl">
              {filteredBooks &&
                filteredBooks.map((data, index) => (
                  <div
                    key={index}
                    className="block p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                    style={{ backgroundColor: "#F3F4F6" }}
                  >
                    <h1
                      className="text-center text-2xl font-semibold "
                      style={{ color: "#111827" }}
                    >
                      {data.bookName}
                    </h1>
                    <hr className="border-t my-2"></hr>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-gray-500 font-bold">
                          รหัส: {data.bookID}
                        </div>
  
                        <div className="text-gray-500">
                          <ul className="list-inside ">
                            <li>หมวดหมู่: {data.bookCategory}</li>
                            <li>จำนวน: {data.bookCount} เล่ม</li>
                            <li>กำลังถูกยืม: {data.borrowing} เล่ม</li>
                            <li>จำนวนหนังสือทั้งหมด: {data.bookCount} เล่ม</li>
                          </ul>
                        </div>
                      </div>
                      <img
                        src={`data:image/jpeg;base64,${data.bookImg}`}
                        className="rounded-xl w-40 h-60"
                        alt=""
                      />
                    </div>
                    <div className="  flex  mt-4 space-x-2">
                      <Link
                        to={`/edit_book?id=${encodeURIComponent(data.bookID)}`}
                        className="flex-grow bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 mx-2 rounded-full transition duration-300 ease-in-out text-center"
                      >
                        เเก้ไข
                      </Link>
                      <button
                        onClick={() => deleteBook(data.bookID)}
                        className="flex-grow bg-red-500 hover:bg-red-600 text-white py-1 px-2 mx-2 rounded-full transition duration-300 ease-in-out"
                      >
                        ลบ
                      </button>
                      <Link
                        to={`/borrowing?id=${encodeURIComponent(data.bookID)}`}
                        className="flex-grow bg-green-500 hover:bg-green-600 text-white py-1 px-2 mx-2 rounded-full transition duration-300 ease-in-out text-center"
                      >
                        ยืมหนังสือ
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </>
    );
  }
  
export default Book;
