import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Swal from "sweetalert2";
import {
  getDocs,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  where,
  query,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

function BorrowList() {
  const [borrowList, setBorrowList] = useState([]);

  useEffect(() => {
    showBorrow();
  }, []);

  const showBorrow = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "borrow"));
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setBorrowList(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBorrow = async (borrow_id, book_id) => {
    try {
      const booksRef = collection(db, "book");
      const q = query(booksRef, where("bookID", "==", book_id));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
          borrowing: increment(-1),
        });
      });
    } catch (error) {
      console.log(error);
    }

    try {
      const borrowRef = doc(db, "borrow", borrow_id);
      await deleteDoc(borrowRef);
      Swal.fire({
        title: "ลบข้อมูลสำเร็จ!",
        icon: "success",
        confirmButtonText: "ยืนยัน",
      });

      showBorrow();
    } catch (error) {
      Swal.fire({
        title: "ลบข้อมูลไม่สำเร็จ!",
        icon: "error",
        confirmButtonText: "ยืนยัน",
      });
    }
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
                          วันที่ยืม: {data.borrowCurrentDate}
                        </p>
                        <p className="text-gray-600 sm:mt-0 sm:ml-6">
                          วันที่ต้องคืน: {data.borrowLastestDate}
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
