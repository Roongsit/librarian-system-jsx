import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

function EditMember() {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");

  const [memberID, setMemberID] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberSurname, setMemberSurname] = useState("");
  const [memberAddress, setMemberAddress] = useState("");
  const [memberPhone_number, setMemberPhone_number] = useState("");

  let navigate = useNavigate(); //redirect ไปหน้าเก่า

  useEffect(() => {
    showMemberByID();
  }, [id]);

  const showMemberByID = async () => {
    if (!id) return;
    const docRef = doc(db, "members", id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMemberID(data.memberID);
        setMemberName(data.memberName);
        setMemberSurname(data.memberSurname);
        setMemberAddress(data.memberAddress);
        setMemberPhone_number(data.memberPhone_number);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  const updateMember = async (e) => {
    e.preventDefault();
    try {
      const memberRef = doc(db, "members", id);
      await updateDoc(memberRef, {
        memberName,
        memberSurname,
        memberAddress,
        memberPhone_number,
      });
      Swal.fire({
        title: 'เปลี่ยนแปลงข้อมูลสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ยืนยัน'
      })

      navigate('/member')
    } catch (error) {
      Swal.fire({
        title: 'เปลี่ยนแปลงข้อมูลไม่สำเร็จ!',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })

    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center py-12 bg-gray-100 min-h-screen">
        <div className="max-w-md w-full space-y-8 bg-white shadow rounded px-10 pt-6 pb-8 mb-4">
          {id ? (
            <form onSubmit={updateMember} className="space-y-6">
              <div>
                <label
                  htmlFor="member-id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Member ID
                </label>
                <input
                  id="member-id"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberID}
                  readOnly // Since Member ID should not be editable
                />
              </div>
              {/* Repeat the above structure for each input field */}
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="first-name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />
              </div>
              {/* Last Name Input */}
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="last-name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberSurname}
                  onChange={(e) => setMemberSurname(e.target.value)}
                />
              </div>
              {/* Last Name Input */}
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="last-name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberSurname}
                  onChange={(e) => setMemberSurname(e.target.value)}
                />
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email" // Assuming you want to capture emails
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberAddress} // Assuming you have a state for this
                  onChange={(e) => setMemberAddress(e.target.value)} // Assuming you have a setter for this
                />
              </div>
              {/* Phone Number Input */}
              <div>
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone-number"
                  type="tel" // Assuming you want to capture telephone numbers
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberPhone_number}
                  onChange={(e) => setMemberPhone_number(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Member
              </button>
            </form>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default EditMember;
