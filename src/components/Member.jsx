import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import { query, getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

function Member() {
  const [memberList, setMemberList] = useState([]);

  useEffect(() => {
    showMember();
  }, []);

  const showMember = async () => {
    try {
      const q = query(collection(db, "members"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        name: doc.memberName,
        surname: doc.memberSurname,
        address: doc.memberAddress,
        number: doc.memberPhone_number,
      }));
      setMemberList(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMember = async (id) => {
    try {
      await deleteDoc(doc(db, "members", id));
      setMemberList(memberList.filter((member) => member.id !== id));
      Swal.fire({
        title: 'ลบข้อมูลสำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ยืนยัน'
      })

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
      <div className="container mx-auto my-4 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Members</h1>
          <Link
            to="/add_member"
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Add Member
          </Link>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {memberList.length > 0 ? (
              memberList.map((data, index) => (
                <li key={data.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        Name: {data.memberName} {data.memberSurname}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <Link
                          to={`/edit_member?id=${encodeURIComponent(data.id)}`}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-5 rounded text-xs "
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteMember(data.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-5 rounded text-xs ml-2 "
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          ID: {data.memberID}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Address: {data.memberAddress}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Number: {data.memberPhone_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li>
                <div className="px-4 py-4 sm:px-6 text-center">
                  No members available
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Member;
