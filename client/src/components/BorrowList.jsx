import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BorrowList() {
  const searchParams = new URLSearchParams(window.location.search);
  const book_id = searchParams.get("id");
  const navigate = useNavigate();

  const [borrowList, setBorrowList] = useState([]);

  useEffect(() => {
    showBorrow();
  }, []);

  const showBorrow = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API + '/get_borrows');
      const newData = response.data.map(borrow => ({
        ...borrow, // Spread all properties of the borrowing record
        id: borrow.borrowID, // This assumes your records have a 'borrowID' field
      }));
      setBorrowList(newData);
    } catch (error) {
      console.error('เข้าถึงข้อมูลผิดพลาด:', error);
    }
  };
const deleteBorrow = async (borrow_id, book_id) => {
  try {
    await axios.put(import.meta.env.VITE_API + `/update_book_return/${book_id}` , {
      increment: - 1,
    });

    await axios.delete(import.meta.env.VITE_API + `/delete_borrow/${borrow_id}`);

    // Show success message
    Swal.fire({
      title: "ลบข้อมูลสำเร็จ!",
      icon: "success",
      confirmButtonText: "ยืนยัน",
    });

    // Refresh the borrow list to show the updated data
    showBorrow();

  } catch (error) {
    console.log(error);
    // Show error message
    Swal.fire({
      title: "ลบข้อมูลไม่สำเร็จ!",
      icon: "error",
      confirmButtonText: "ยืนยัน",
    });
  }
};


const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-CA', options);
};


  return (
    <>
      <Nav />
      <div className="container mx-auto my-4 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            รายชื่อสมาชิกที่ยืมหนังสือ
          </h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg w-full">
            <ul className="divide-y divide-gray-200">
              {borrowList.length > 0 ? (
                borrowList.map((data, index) => (
                  <li key={data.id} >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-[#47BA6E] truncate">
                          Name: {data.memberName} {data.memberSurname}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex mb-4">
                        <button
                          className="w-20 bg-red-500 hover:bg-red-600 text-white py-1 px-6 mx-2 rounded-full transition duration-300 ease-in-out"
                          onClick={() => deleteBorrow(data.id, data.bookID)}
                        >
                          ลบ
                        </button>
                        
                      
                        </div>
                      </div>

                      <div className="flex items-centerjustify-start ">
                      <p className="text-gray-600 ">
                          รหัสหนังสือ: {data.bookID}
                        </p>
                        <p className="text-gray-600 sm:mt-0 sm:ml-6">
                          วันที่ยืม:  {formatDate(data.borrowCurrentDate)}
                        </p>
                        <p className="text-gray-600 sm:mt-0 sm:ml-6">
                          วันที่ต้องคืน: {formatDate(data.borrowLastestDate)}
                        </p>
                        </div>
                    </div>
                  </li>
                ))
              ) : (
                <li>
                  <div className="text-center text-gray-500">
                    ไม่มีข้อมูลการยืมหนังสือ
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default BorrowList;
