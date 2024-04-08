import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Swal from "sweetalert2";
import axios from "axios";

function Addbook() {
  const [categories, setCategories] = useState([]);
  const [bookID, setBookID] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [bookCount, setBookCount] = useState("");
  const [bookImg, setBookImg] = useState(null); // Initialized as null for file

  useEffect(() => {
    get_category();
  }, []);

  const get_category = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API + "/get_category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
  
    // Check if all required fields are filled
    if (!bookImg || !bookID || !bookName || !bookCategory || !bookCount) {
      Swal.fire({
        title: "โปรดใส่ข้อมูลให้ครบถ้วน!",
        icon: "error",
        confirmButtonText: "ยืนยัน",
      });
      return;
    }
  
    // const reader = new FileReader();
    // reader.readAsDataURL(bookImg);
    // reader.onload = async () => {
    //   const base64Data = reader.result.split(',')[1]; 
  
      const formData = new FormData();
      formData.append('id', bookID);
      formData.append('name', bookName);
      formData.append('category', bookCategory);
      formData.append('amount', bookCount);
      formData.append('file', bookImg); 
  
      try {
        const response = await axios.post(import.meta.env.VITE_API + '/post_book', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Reset form fields after successful upload
        setBookID("");
        setBookName("");
        setBookCategory("");
        setBookCount("");
        setBookImg(null);
  
        // Show success message
        Swal.fire({
          title: "เพิ่มหนังสือสำเร็จ!",
          icon: "success",
          confirmButtonText: "ยืนยัน",
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "เพิ่มหนังสือไม่สำเร็จ!",
          icon: "error",
          confirmButtonText: "ยืนยัน",
        });
      // }
    };
  };
  
  return (
    <div>
      <Nav />

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="drop-shadow-xl w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <form onSubmit={addBook} className="space-y-4">
            <div>
              <label
                htmlFor="bookID"
                className="block text-md font-medium text-gray-700"
              >
                Book ID
              </label>
              <input
                id="bookID"
                type="text"
                placeholder="รหัสหนังสือ"
                className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-[#77BA47]"
                value={bookID}
                onChange={(e) => setBookID(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="bookName"
                className="block text-md font-medium text-gray-700"
              >
                Book Name
              </label>
              <input
                id="bookName"
                type="text"
                placeholder="ชื่อหนังสือ"
                className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-[#77BA47]"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              />
            </div>
            <label
              htmlFor="book-category"
              className="block text-md font-medium text-gray-700"
            >
              Book Category
            </label>
            <select
              id="book-category"
              name="bookCategory"
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-[#77BA47]"
              value={bookCategory}
              onChange={(e) => setBookCategory(e.target.value)}
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((category) => (
                <option key={category.categoryID} value={category.name}>
                  {category.categoryName}
                </option>
              ))}
            </select>
            <div>
              <label
                htmlFor="bookCount"
                className="block text-md font-medium text-gray-700"
              >
                Book Count
              </label>
              <input
                id="bookCount"
                type="number"
                placeholder="จำนวนเล่ม"
                className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-[#77BA47]"
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
                className="appearance-none rounded-none relative block w-full px-4 py-2 border  text-gray-700 focus:outline-none focus:border-[#77BA47]"
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
                className="w-full flex justify-center px-4 py-2 bg-[#47BA6E] text-white rounded-lg hover:bg-[#77BA47] transition"
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Addbook;
