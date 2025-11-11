import React, { useState, useEffect } from "react";
import { borrowAPI } from "../services/api";
import Navbar from "../components/Navbar";

const BorrowHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await borrowAPI.getUserHistory();
      setRecords(response.data);
    } catch (err) {
      setError("Failed to load borrow history");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (recordId) => {
    try {
      await borrowAPI.return(recordId);
      setSuccessMsg("Book returned successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchHistory();
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Loading history...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Borrow History</h1>

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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Book Title
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
                      {record.returnDate ? "Returned" : "Borrowed"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!record.returnDate && (
                      <button
                        onClick={() => handleReturn(record.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        Return
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
            No borrow history found
          </div>
        )}
      </div>
    </>
  );
};

export default BorrowHistory;
