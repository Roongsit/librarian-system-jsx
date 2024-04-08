import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Swal from "sweetalert2";
import { AiOutlinePlus } from "react-icons/ai";
import  axios from 'axios';

function Category() {
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_API + '/get_category');
      setCategoryList(response.data);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new category to Firestore
  const handleSwalError = (message, err) => {
    console.error(message, err);
    Swal.fire({
      title: `${message}`,
      icon: "error",
      confirmButtonText: "ยืนยัน",
    });
  };
  
  // Success handling function to display SweetAlert messages
  const handleSwalSuccess = (message) => {
    Swal.fire({
      title: `${message}`,
      icon: "success",
      confirmButtonText: "ยืนยัน",
    });
  };
  
  const addCategory = async (e) => {
    e.preventDefault();
    if (!categoryInput.trim()) {
      Swal.fire({
        title: "เพิ่มไม่สำเร็จ!",
        text: "กรุณาใส่ข้อมูลให้ครบถ้วน",
        icon: "error",
        confirmButtonText: "ยืนยัน",
      });
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_API + '/post_category',
       { categoryName: categoryInput });
      setCategoryList(response.data);
      setCategoryInput("");
      fetchCategories(); // Assuming this is an async operation but it's not awaited here. Consider if this needs await or not based on its implementation.
      handleSwalSuccess("เพิ่มข้อมูลสำเร็จ!");
    } catch (err) {
      handleSwalError("เพิ่มข้อมูลไม่สำเร็จ!", err);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteCategory = async (categoryID) => {
    setLoading(true);
    console.log(categoryID);

    try {
      await axios.delete(import.meta.env.VITE_API + `/delete_category/${categoryID}`);
      fetchCategories(); // Same note as above regarding awaiting this operation if it's asynchronous.
      handleSwalSuccess("ลบข้อมูลสำเร็จ!");
    } catch (err) {
      handleSwalError("ลบข้อมูลไม่สำเร็จ!", err);
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <>
      <Nav />
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={addCategory} className="mb-4">
              <div className="mb-4">
                <div className="flex justify-between mb-4">
                  <label
                    htmlFor="category"
                    className="block text-gray-700 text-2xl font-bold mb-2"
                  >
                    หมวดหมู่
                  </label>
  
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-block px-2 py-1 bg-transparent border-2 border-green-500 text-green-500 text-sm rounded-full transition-colors duration-700 transform hover:bg-green-500 hover:text-gray-100 focus:border-4 focus:border-green-300"
                  >
                    <AiOutlinePlus className="inline-block m-1" />
                    เพิ่มหมวดหมู่
                  </button>
                </div>
                <input
                  id="category"
                  type="text"
                  placeholder="ใส่ประเภทของหนังสือ"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="shadow appearance-none w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-[#77BA47]"
                />
              </div>
            </form>
            <div>
              {loading ? (
                <p>Loading categories...</p>
              ) : categoryList.length > 0 ? (
                <ul>
                  {categoryList.map((category,index) => (
                    <li
                      
                      key={index}
                      className="flex justify-between items-center bg-white px-4 py-2 rounded shadow mb-2"
                    >
                      <span className="text-gray-800">{category.categoryName}</span>
                      <button
                        onClick={() => deleteCategory(category.categoryID)}
                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-6 rounded-full focus:outline-none focus:shadow-outline"
                      >
                        ลบ
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No categories available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Category;
