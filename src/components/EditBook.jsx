import React, { useState, useEffect } from "react";
import { db, storageRef } from "../firebase";
import {
  query,
  getDocs,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Nav from "./Nav";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from 'sweetalert2'


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
      showBookByID();
      showCategory();
    }, [id]);
  
    const showCategory = async () => {
      try {
        const q = query(collection(db, "category"));
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategoryList(newData);
      } catch (error) {
        console.error(error);
      }
    };
  
    //show book id
    const showBookByID = async () => {
      if (!id) return;
  
      const docRef = doc(db, "book", id);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBookID(data.bookID);
          setBookName(data.bookName);
          setBookCategory(data.bookCategory);
          setBookCount(data.bookCount);
          setBookImg(data.bookImg);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };
  
    //id
    const updateBook = async (e) => {
      e.preventDefault();
      try {
        let imgURL = bookImg;
        if (newBookImg) {
          const imgRef = ref(storageRef, `books/${new Date().getTime()}_${newBookImg.name}`);
          const snapshot = await uploadBytes(imgRef, newBookImg);
          imgURL = await getDownloadURL(snapshot.ref);
        }
        const bookRef = doc(db, "book", id);
        await updateDoc(bookRef, {
          bookID : bookID,
          bookName : bookName,
          bookCategory : bookCategory,
          bookCount: parseInt(bookCount, 10),
          bookImg: imgURL,
        });
        Swal.fire({
          title: 'เปลี่ยนแปลงข้อมูลสำเร็จ!',
          icon: 'success',
          confirmButtonText: 'ยืนยัน'
        })
  
      } catch (error) {
        console.error("Error updating document:", error);
        alert("Error updating book!");
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
                <label htmlFor="book-id" className="block text-sm font-medium text-gray-700">Book ID</label>
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
                <label htmlFor="book-name" className="block text-sm font-medium text-gray-700">Book Name</label>
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
                <label htmlFor="book-category" className="block text-sm font-medium text-gray-700">Book Category</label>
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
                    <option key={category.id} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="book-count" className="block text-sm font-medium text-gray-700">Book Count</label>
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
                <label htmlFor="book-img" className="block text-sm font-medium text-gray-700">Book Image</label>
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
