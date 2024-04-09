import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserAuthContextProvider } from './context/UserAuthContext.jsx';

import Register from "./components/Register.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Book from "./components/Book.jsx";
import AddBook from "./components/AddBook.jsx";
import EditBook from "./components/EditBook.jsx";
import Member from "./components/Member.jsx";
import AddMember from "./components/AddMember.jsx";
import EditMember from "./components/EditMember.jsx";
import Borrowing from "./components/Borrowing.jsx";
import BorrowList from "./components/BorrowList.jsx";
import Category from "./components/Category.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/book",
    element: (
      <ProtectedRoute>
        <Book />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add_book",
    element: (
      <ProtectedRoute>
        <AddBook />
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit_book",
    element: (
      <ProtectedRoute>
        <EditBook />
      </ProtectedRoute>
    ),
  },
  {
    path: "/member",
    element: (
      <ProtectedRoute>
        <Member />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add_member",
    element: (
      <ProtectedRoute>
        <AddMember />
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit_member",
    element: (
      <ProtectedRoute>
        <EditMember />
      </ProtectedRoute>
    ),
  },
  {
    path: "/borrowing",
    element: (
      <ProtectedRoute>
        <Borrowing />
      </ProtectedRoute>
    ),
  },
  {
    path: "/borrow_list",
    element: (
      <ProtectedRoute>
        <BorrowList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/category",
    element: (
      <ProtectedRoute>
        <Category />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>
);
