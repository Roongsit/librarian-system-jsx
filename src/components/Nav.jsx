import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBookReader } from 'react-icons/fa'; // Importing the icon

function NavigationBar() {
  const { logOut } = useUserAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className=" font-sarabun bg-gradient-to-br from-[#77BA47] to-[#47BA6E] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <FaBookReader className="text-2xl md:text-3xl"/> {/* Icon added */}
            {/* Rest of your navigation items here */}
          </div>
          <div className="flex items-center space-x-4">
            {/* Links for larger screens */}
            <a href="/book" className="hidden md:block py-2 px-3 hover:bg-[#546548] rounded transition duration-300">หนังสือทั้งหมด</a>
            <a href="/member" className="hidden md:block py-2 px-3 hover:bg-[#546548] rounded transition duration-300">รายชื่อสมาชิก</a>
            <a href="/borrow_list" className="hidden md:block py-2 px-3 hover:bg-[#546548] rounded transition duration-300">รายชื่อหนังสือที่ถูกยืม</a>
            {/* Logout button */}
            <button onClick={handleLogout} className="hidden md:block bg-[#373B34] hover:bg-[#546548] py-2 px-4 rounded transition duration-300">
              Logout
            </button>
            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-purple-500`}>
        <a href="/book" className="block py-2 px-4 text-sm hover:bg-purple-600">Book</a>
        <a href="/member" className="block py-2 px-4 text-sm hover:bg-purple-600">Member</a>
        <a href="/borrow_list" className="block py-2 px-4 text-sm hover:bg-purple-600">Borrow List</a>
        <button onClick={handleLogout} className="w-full text-left py-2 px-4 text-sm text-red-500 hover:bg-purple-600">Logout</button>
      </div>
    </nav>
  );
}

export default NavigationBar;
