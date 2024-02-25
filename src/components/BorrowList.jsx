import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Swal from 'sweetalert2'
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
        title: 'ลบข้อมูลสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ยืนยัน'
      })

      showBorrow();
    } catch (error) {
      Swal.fire({
        title: 'ลบข้อมูลไม่สำเร็จ!',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })

    }
  };

  return (
    <>
      <Nav />
      <div className=" container font-sarabun mx-auto my-4 p-4">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">รายชื่อสมาชิกที่ยืมหนังสือ</h1>
          <div className="bg-white p-8 rounded-md">
            {borrowList.length > 0 ? (
              borrowList.map((data, index) => (
                <div
                  key={data.id}
                  className="mb-6 p-6 shadow-lg rounded-lg bg-white"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {data.memberName} {data.memberSurname}
                      </h2>
                      <p className="text-gray-600">รหัสหนังสือ: {data.bookID}</p>
                      <p className="text-gray-600">
                        วันที่ยืม: {data.borrowCurrentDate}
                      </p>
                      <p className="text-gray-600">
                        วันที่ต้องคืน: {data.borrowLastestDate}
                      </p>
                    </div>
                    <div>
                      <button
                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md focus:outline-none"
                        onClick={() => deleteBorrow(data.id, data.bookID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No borrows found</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BorrowList;
