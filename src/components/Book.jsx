import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { db } from "../firebase";
import { query, getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// Delete
import { doc, deleteDoc } from "firebase/firestore";

function Book() {
  const [bookList, setBookList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

  useEffect(() => {
    showBook();
  }, []);

  const showBook = async () => {
    try {
      const q = query(collection(db, "book"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setBookList(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async (id) => {
    try {
      await deleteDoc(doc(db, "book", id));
      setBookList(bookList.filter((book) => book.id !== id));
      Swal.fire({
        title: 'ลบข้อมูลสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ยืนยัน'
      });
    } catch (error) {
      Swal.fire({
        title: 'ลบข้อมูลไม่สำเร็จ!',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      });

    }
  };

  const filteredBooks =
    searchTerm.length === 0
      ? bookList
      : bookList.filter((book) =>
          book.bookName.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <>
      <Nav />
      <div className="font-sarabun container mx-auto px-4 py-8">
        <div className="flex  justify-start items-center">
          <Link
            to="/add_book"
            className="inline-block m-4 text-white text-sm bg-green-500 hover:bg-green-600 p-2 rounded-full transition duration-300 ease-in-out"
          >
            เพิ่มรายการหนังสือ
          </Link>
          <Link
            to="/category"
            className="inline-block m-4 text-white text-sm bg-green-500 hover:bg-green-600 p-2 rounded-full transition duration-300 ease-in-out"
          >
            เพิ่มหมวดหมู่
          </Link>

          <input
            type="text"
            className="  shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-auto"
            placeholder="Search for books..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ justifySelf: "end" }}
          />
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks &&
              filteredBooks.map((data, index) => (
                <div
                  key={index}
                  className="block p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                  style={{ backgroundColor: "#F3F4F6" }}
                >
                  <h1
                    className="text-center text-2xl font-semibold "
                    style={{ color: "#111827" }}
                  >
                    {data.bookName}
                  </h1>
                  <hr class="border-t my-2"></hr>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500 font-bold">
                        รหัส: {data.bookID}
                      </p>

                      <p className="text-gray-500">
                        <ul className="list-inside ">
                          <li>หมวดหมู่: {data.bookCategory}</li>
                          <li>จำนวน: {data.amount} เล่ม</li>
                          <li>กำลังถูกยืม: {data.borrowing} เล่ม</li>
                          <li>จำนวนหนังสือทั้งหมด: {data.bookCount} เล่ม</li>
                        </ul>
                      </p>
                    </div>
                    <img
                      src={data.bookImg}
                      className="rounded-xl w-40 h-60"
                      alt=""
                    />
                  </div>
                  <div className="  flex  mt-4 space-x-2">
                    <Link
                      to={`/edit_book?id=${encodeURIComponent(data.id)}`}
                      className="flex-grow bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded transition duration-300 ease-in-out text-center"
                    >
                      เเก้ไข
                    </Link>
                    <button
                      onClick={() => deleteBook(data.id)}
                      className="flex-grow bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded transition duration-300 ease-in-out"
                    >
                      ลบ
                    </button>
                    <Link
                      to={`/borrowing?id=${encodeURIComponent(data.id)}`}
                      className="flex-grow bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded transition duration-300 ease-in-out text-center"
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
