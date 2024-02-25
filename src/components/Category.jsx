import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { db } from "../firebase";
import { collection, addDoc, query, getDocs, deleteDoc ,doc } from "firebase/firestore";
import Swal from 'sweetalert2'

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
        title: 'เพิ่มไม่สำเร็จ!',
        text: 'กรุณาใส่ข้อมูลให้ครบถ้วน',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })

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
        title: 'เพิ่มข้อมูลสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ยืนยัน'
      })

    } catch (err) {
      Swal.fire({
        title: 'เพิ่มข้อมูลไม่สำเร็จ!',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })

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
        title: 'ลบข้อมูลสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ยืนยัน'
      })

    } catch (err) {
      Swal.fire({
        title: 'ลบข้อมูลไม่สำเร็จ!',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })

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
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  placeholder="ใส่ประเภทของหนังสือ"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                Add Category
              </button>
            </form>
            <div>
              {loading ? (
                <p>Loading categories...</p>
              ) : categoryList.length > 0 ? (
                <ul>
                  {categoryList.map((category, index) => (
                    <li key={category.id} className="flex justify-between items-center bg-white px-4 py-2 rounded shadow mb-2">
                      <span className="text-gray-800">{category.category}</span>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                      >
                        Delete
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
