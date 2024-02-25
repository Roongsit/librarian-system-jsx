import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { AiOutlinePlus } from "react-icons/ai";
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
      const q = query(collection(db, "category"));
      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategoryList(categories);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new category to Firestore
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
      await addDoc(collection(db, "category"), {
        category: categoryInput.trim(),
      });
      setCategoryInput("");
      fetchCategories();
      Swal.fire({
        title: "เพิ่มข้อมูลสำเร็จ!",
        icon: "success",
        confirmButtonText: "ยืนยัน",
      });
    } catch (err) {
      Swal.fire({
        title: "เพิ่มข้อมูลไม่สำเร็จ!",
        icon: "error",
        confirmButtonText: "ยืนยัน",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a category from Firestore
  const deleteCategory = async (categoryId) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "category", categoryId));
      fetchCategories();
      Swal.fire({
        title: "ลบข้อมูลสำเร็จ!",
        icon: "success",
        confirmButtonText: "ยืนยัน",
      });
    } catch (err) {
      Swal.fire({
        title: "ลบข้อมูลไม่สำเร็จ!",
        icon: "error",
        confirmButtonText: "ยืนยัน",
      });
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
                    className="inline-block px-2  py-1  bg-transparent border-2 border-green-500 text-green-500 text-sm rounded-full transition-colors duration-700 transform hover:bg-green-500 hover:text-gray-100 focus:border-4 focus:border-green-300"
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
                  {categoryList.map((category, index) => (
                    <li
                      key={category.id}
                      className="flex justify-between items-center bg-white px-4 py-2 rounded shadow mb-2"
                    >
                      <span className="text-gray-800">{category.category}</span>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-6  rounded-full focus:outline-none focus:shadow-outline"
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
