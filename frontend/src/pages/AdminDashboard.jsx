import React, { useState, useEffect } from "react";
import { borrowAPI } from "../services/api";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchAllRecords();
  }, []);

  const fetchAllRecords = async () => {
    try {
      const response = await borrowAPI.getAllRecords();
      setRecords(response.data);
    } catch (err) {
      setError("Failed to load borrow records");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (recordId) => {
    try {
      await borrowAPI.return(recordId);
      setSuccessMsg("Book returned successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchAllRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to return book");
      setTimeout(() => setError(""), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const activeLoans = records.filter((r) => !r.returnDate).length;
  const totalLoans = records.length;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Loading dashboard...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-100 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-blue-800">Active Loans</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {activeLoans}
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-green-800">Total Loans</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {totalLoans}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMsg}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">All Borrow Records</h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Borrow Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4">{record.userName}</td>
                  <td className="px-6 py-4">{record.bookTitle}</td>
                  <td className="px-6 py-4">{formatDate(record.borrowDate)}</td>
                  <td className="px-6 py-4">
                    {record.returnDate ? formatDate(record.returnDate) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        record.returnDate
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.returnDate ? "Returned" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!record.returnDate && (
                      <button
                        onClick={() => handleReturn(record.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        Mark Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {records.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No borrow records found
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
