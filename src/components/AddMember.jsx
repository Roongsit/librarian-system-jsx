import React, { useState } from "react";
import { db } from "../firebase";
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import Nav from "./Nav";
import Swal from 'sweetalert2'

function Member() {
  const [memberID, setMemberID] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberSurname, setMemberSurname] = useState("");
  const [memberAddress, setMemberAddress] = useState("");
  const [memberPhone_number, setMemberPhone_number] = useState('');

  const navigate = useNavigate();

  const addMember = async (e) => {
    e.preventDefault();
  
    if (!memberID || !memberName || !memberSurname || !memberAddress || !memberPhone_number) {
      Swal.fire({
        title: 'เพิ่มสมาชิกไม่สำเร็จ!',
        text: 'กรุณาใส่ข้อมูลให้ครบถ้วน',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })

      return; 
    }

    const emailPattern = /^[^@]+@gmail\.com$/;
    if (!emailPattern.test(memberAddress)) {
      Swal.fire({
        title: 'Email ไม่ถูกต้อง!',
        text: 'กรุณาใช้ Email ที่มีนามสกุล @gmail.com',
        icon: 'warning',
        confirmButtonText: 'ยืนยัน'
      });
      return;
    }
    
    try {
      await addDoc(collection(db, "members"), {
        memberID,
        memberName,
        memberSurname,
        memberAddress,
        memberPhone_number
      });
      setMemberID("");
      setMemberName("");
      setMemberSurname("");
      setMemberAddress("");
      setMemberPhone_number("");
      Swal.fire({
        title: 'เพิ่มสมาชิกสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ยืนยัน'
      })
      navigate("/member"); // Navigate to the member page
    } catch (error) {
      Swal.fire({
        title: 'เพิ่มสมาชิกไม่สำเร็จ!',
        icon: 'error',
        confirmButtonText: 'ยืนยัน'
      })
    }
  };
    return (
    <div>
      <Nav />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <form onSubmit={addMember} className="space-y-4">
            <div>
              <label htmlFor="memberID" className="block text-sm font-medium text-gray-700">Member ID</label>
              <input
                id="memberID"
                type="number"
                placeholder="Member ID"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={memberID}
                onChange={(e) => setMemberID(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="ชื่อจริง"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="นามสกุล"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={memberSurname}
                onChange={(e) => setMemberSurname(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="address"
                type="text"
                placeholder="อีเมล"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={memberAddress}
                onChange={(e) => setMemberAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phoneNumber"
                type="text"
                placeholder="เบอร์โทรศัพท์"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={memberPhone_number}
                onChange={(e) => setMemberPhone_number(e.target.value)}
              />
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Member;
