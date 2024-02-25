import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { db, storageRef } from "../firebase"; // Make sure storage is correctly imported
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from 'sweetalert2'

function Addbook() {
  const [bookID, setBookID] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [bookCount, setBookCount] = useState("");
  const [bookImg, setBookImg] = useState(null); // Initialized as null for file

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    showCategory();
  }, []);

  const showCategory = async () => {
    try {
      const q = query(collection(db, "category"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategoryList(newData);
      console.log(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const addBook = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!bookImg) {
      alert("Please select an image for the book");
      return;
    }
    const Ref = ref(storageRef, `book/${bookImg.name}`);

    if (!bookID || !bookName || !bookCategory || !bookCount) {
      Swal.fire({
        title: 'โปรดใส่ข้อมูลให้ครบถ้วน!',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })

      return;
    }

    try {
      // Step 1: Upload the image to Firebase Storage
      const snapshot = await uploadBytes(Ref, bookImg);
      // Step 2: Get the URL of the uploaded file
      const imgURL = await getDownloadURL(snapshot.ref);
      // Step 3: Add a new document in Firestore collection with book details
      await addDoc(collection(db, "book"), {
        bookID,
        bookName,
        bookCategory,
        bookCount: parseInt(bookCount, 10), // Make sure bookCount is an integer
        bookImg: imgURL,
        borrowing: 0,
      });
      // Reset form (optional)
      setBookID("");
      setBookName("");
      setBookCategory("");
      setBookCount("");
      setBookImg(null);
      Swal.fire({
        title: 'เพิ่มหนังสือสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ยืนยัน'
      })

    } catch (error) {
      Swal.fire({
        title: 'เพิ่มหนังสือไม่สำเร็จ!',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })
    }
  };

  return (
    <div>
      <Nav />

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <form onSubmit={addBook} className="space-y-4">
            <div>
              <label
                htmlFor="bookID"
                className="block text-sm font-medium text-gray-700"
              >
                Book ID
              </label>
              <input
                id="bookID"
                type="text"
                placeholder="รหัสหนังสือ"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={bookID}
                onChange={(e) => setBookID(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="bookName"
                className="block text-sm font-medium text-gray-700"
              >
                book Name
              </label>
              <input
                id="bookName"
                type="text"
                placeholder="ชื่อหนังสือ"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              />
            </div>
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
              <option value="">เลือกประเภทหนังสือ</option>
              {categoryList.map((category) => (
                <option key={category.id} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
            <div>
              <label
                htmlFor="bookCount"
                className="block text-sm font-medium text-gray-700"
              >
                Book Count
              </label>
              <input
                id="bookCount"
                type="number"
                placeholder="จำนวนเล่ม"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={bookCount}
                onChange={(e) => setBookCount(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="book-img" className="sr-only">
                Phone Number
              </label>
              <input
                id="book-img"
                name="bookImg"
                type="file"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                accept=".jpg, .jpeg, .png" // Accept JPEG and PNG files
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const fileType = file.type;
                    const validImageTypes = ["image/jpeg", "image/png"];
                    if (!validImageTypes.includes(fileType)) {
                      alert("Only JPG and PNG files are allowed.");
                      e.target.value = null; // Clear the input
                    } else {
                      setBookImg(file);
                    }
                  }
                }}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Addbook;
