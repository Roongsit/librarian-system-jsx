import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function EditMember() {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");

  const [memberData, setMemberData] = useState({
    memberID: "",
    memberName: "",
    memberSurname: "",
    memberAddress: "",
    memberPhone_number: "",
  });

  let navigate = useNavigate();

  useEffect(() => {
    if (id) {
      showMemberByID(id);
    }
  }, [id]);

  const showMemberByID = async (memberID) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API + `/get_member/${memberID}`
      );
      if (response.data) {
        setMemberData({
          memberID: response.data.membersID,
          memberName: response.data.membersName,
          memberSurname: response.data.membersSurname,
          memberAddress: response.data.memberAddress,
          memberPhone_number: response.data.membersPhone_number,
        });
      } else {
        console.log("ไม่พบข้อมูลสมาชิก!");
      }
    } catch (error) {
      console.error("ข้อมูลสมาชิกผิดพลาด:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const editMember = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        import.meta.env.VITE_API + `/edit_member/${id}`,
        memberData
      );
      if (response.status === 200) {
        Swal.fire({
          title: "แก้ไขข้อมูลสำเร็จ!",
          icon: "success",
          confirmButtonText: "ยืนยัน",
        });
        navigate("/member"); 
      }
    } catch (error) {
      Swal.fire({
        title: "แก้ไขข้อมูลไม่สำเร็จ!",
        text: error.response?.data?.message || "An error occurred",
        icon: "error",
        confirmButtonText: "ยืนยัน",
      });
    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center justify-center py-12 bg-gray-100 min-h-screen">
        <div className="max-w-md w-full space-y-8 bg-white shadow rounded px-10 pt-6 pb-8 mb-4">
          {memberData.memberID ? (
            <form onSubmit={editMember} className="space-y-6">
              {/* Member ID (Read Only) */}
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
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberData.memberID}
                  readOnly
                />
              </div>

              {/* Member Name Input */}
              <div>
                <label
                  htmlFor="member-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="member-name"
                  name="memberName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberData.memberName}
                  onChange={handleInputChange}
                />
              </div>

              {/* Member Surname Input */}
              <div>
                <label
                  htmlFor="member-surname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="member-surname"
                  name="memberSurname"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberData.memberSurname}
                  onChange={handleInputChange}
                />
              </div>

              {/* Member Email Input */}
              <div>
                <label
                  htmlFor="member-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="member-email"
                  name="memberEmail" // This should match the key expected by your server
                  type="email"
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberData.memberEmail} // Update your state to use memberEmail
                  onChange={handleInputChange}
                />
              </div>

              {/* Member Phone Number Input */}
              <div>
                <label
                  htmlFor="member-phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="member-phone"
                  name="memberPhone_number"
                  type="tel"
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={memberData.memberPhone_number}
                  onChange={handleInputChange}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Member
              </button>
            </form>
          ) : (
            <p>Loading...</p> // Display a loading message or spinner here
          )}
        </div>
      </div>
    </>
  );
}

export default EditMember;
