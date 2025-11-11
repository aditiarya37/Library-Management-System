import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/books" className="text-2xl font-bold">
            Library System
          </Link>

          <div className="flex items-center space-x-6">
            {user && (
              <>
                <Link to="/books" className="hover:text-blue-200">
                  Books
                </Link>
                {user.role === "USER" && (
                  <Link to="/history" className="hover:text-blue-200">
                    My History
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <>
                    <Link to="/admin" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link to="/admin/books" className="hover:text-blue-200">
                      Manage Books
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
