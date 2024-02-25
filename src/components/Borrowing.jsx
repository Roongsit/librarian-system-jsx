import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { db } from "../firebase";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

function Borrowing() {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");

  //book
  const [bookID, setBookID] = useState("");
  const [bookName, setBookName] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [bookCount, setBookCount] = useState(null);
  const [bookImg, setBookImg] = useState("");
  const [borrowing, setBorrowing] = useState(null);

  //member
  const [memberName, setMemberName] = useState("");
  const [memberSurname, setMemberSurname] = useState("");
  const [memberID, setMemberID] = useState(null);

  //validation
  const [memberValidID, setMemberValidID] = useState(null);
  const [valid, setValid] = useState(false);

  //date
  const currentDate = new Date().toLocaleDateString();
  const lastestDate = new Date(
    new Date().setDate(new Date().getDate() + 7)
  ).toLocaleDateString();

  const navigate = useNavigate();

  useEffect(() => {
    showBookByID();
  }, [id]);

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
        setBorrowing(data.borrowing);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  const validation = async (e) => {
    e.preventDefault();
    try {
      const q = query(
        collection(db, "members"),
        where("memberID", "==", memberValidID)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(data);
          setValid(true);
          setMemberName(data.memberName);
          setMemberSurname(data.memberSurname);
          setMemberID(data.memberID);
          console.log(data);
        });
      } else {
        console.log("No matching documents.");
        setValid(false);
      }
    } catch (error) {
      setValid(false);
      console.log("Error getting document:", error);
    }
  };

  const borrow_book = async () => {
    if (borrowing == bookCount) {
      Swal.fire({
        title: 'ยืมไม่สำเร็จ!',
        text: 'ไม่มีหนังสือที่สามารถยืมได้',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })
      
      return;
    }

    try {
      const bookRef = doc(db, "book", id);
      await updateDoc(bookRef, {
        borrowing: borrowing + 1,
      });
    } catch (error) {
      console.log(error);
      alert("มีบางอย่างผิดพลาด");
    }

    try {
      const createBorrow = await addDoc(collection(db, "borrow"), {
        memberID: memberID,
        memberName: memberName,
        memberSurname: memberSurname,
        bookID: bookID,
        bookName: bookName,
        borrowCurrentDate: currentDate,
        borrowLastestDate: lastestDate,
      });
      console.log("pass");
      Swal.fire({
        title: 'ยืมสำเร็จ!',
        text: 'ระบบกำลังพาไปรายชื่อหนังสือที่ถูกยืม',
        icon: 'success',
        confirmButtonText: 'ยืนยัน'
      })
      navigate("/borrow_list");
    } catch (error) {
      Swal.fire({
        title: 'ยืมไม่สำเร็จ!',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })

    }
  };



  return (
    <>
      <Nav />
      <div className="container mx-auto p-4 text-gray-800">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Borrow a Book
        </h2>
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <p className="font-medium">
              ชื่อหนังสือ: <span className="text-green-600">{bookName}</span>
            </p>
            <p className="font-medium">
              หมวดหมู่: <span className="text-green-600">{bookCategory}</span>
            </p>
            <p className="font-medium">จำนวนหนังสือทั้งหมด: {bookCount}</p>
            <p className="font-medium">จำนวนหนังสือที่ถูกยืม: {borrowing}</p>
            {bookImg && (
              <img
                src={bookImg}
                alt="Cover of the book"
                className="mt-4 w-32 h-40 object-cover"
              />
            )}
          </div>
        </div>

        {/* Form for member validation */}
        <form onSubmit={validation} className="mb-4">
          <label
            htmlFor="memberID"
            className="block text-sm font-medium text-gray-700"
          >
            Member ID:
          </label>
          <input
            type="number"
            id="memberID"
            className="mt-1 block w-full border-gray-300 shadow-sm rounded-md p-2"
            value={memberValidID || ""}
            onChange={(e) => setMemberValidID(e.target.value)}
          />
          <button
            type="submit"
            className="mt-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            ตรวจสอบรหัสสมาชิก
          </button>
        </form>

        {valid ? (
          <div className="bg-white shadow-md rounded-lg p-4 mt-4">
            <p className="font-medium">
              รหัสสมาชิก: <span className="text-green-600">{memberID}</span>
            </p>
            <p className="font-medium">
              ชื่อสมาชิก:{" "}
              <span className="text-green-600">
                {memberName} , {memberSurname}
              </span>
            </p>
            <p className="font-medium">
              รหัสหนังสือ: <span className="text-green-600">{bookID}</span>
            </p>
            <p className="font-medium">
              ชื่อหนังสือ: <span className="text-green-600">{bookName}</span>
            </p>
            <p className="font-medium">
              วันที่ยืม: <span className="text-green-600">{currentDate}</span>
            </p>
            <p className="font-medium">
              วันครบกำหนด: <span className="text-green-600">{lastestDate}</span>
            </p>

            <button
              className="mt-4 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              type="button"
              onClick={borrow_book}
            >
              ยืนยันการยืม
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Borrowing;
