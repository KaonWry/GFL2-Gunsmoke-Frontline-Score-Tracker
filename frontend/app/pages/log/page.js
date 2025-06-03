"use client";
import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/app/apiConfig";

export default function LogPage() {
  const [attempts, setAttempts] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [resetStatus, setResetStatus] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [importStatus, setImportStatus] = useState("");
  const fileInputRef = useRef();

  const fetchAttempts = async () => {
    const res = await fetch(`${API_BASE_URL}/get_attempts`);
    const data = await res.json();
    setAttempts(data);
  };

  const handleDeleteClick = (id) => {
    setConfirmId(id);
  };

  const confirmDelete = async () => {
    if (confirmId !== null) {
      await fetch(`${API_BASE_URL}/delete_attempt/${confirmId}`, {
        method: "DELETE",
      });
      setConfirmId(null);
      fetchAttempts();
    }
  };

  const cancelDelete = () => {
    setConfirmId(null);
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const handleExportCSV = () => {
    window.open(`${API_BASE_URL}/export_csv?table=log`, "_blank");
  };

  const handleResetDB = () => {
    setShowResetModal(true);
  };

  const confirmResetDB = async () => {
    setResetStatus("Resetting...");
    setShowResetModal(false);
    try {
      const res = await fetch(`${API_BASE_URL}/reset_db`, { method: "POST" });
      const data = await res.json();
      setResetStatus(data.message || data.error || "Unknown response");
      fetchAttempts();
    } catch (err) {
      setResetStatus("Failed to reset database.");
    }
  };

  const cancelResetDB = () => {
    setShowResetModal(false);
  };

  const handleImportCSV = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const onFileChange = async (e) => {
    setImportStatus("");
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setImportStatus("Importing...");
    try {
      const res = await fetch(`${API_BASE_URL}/import_csv`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImportStatus(data.message || data.error || "Unknown response");
      fetchAttempts();
    } catch (err) {
      setImportStatus("Failed to import CSV.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-center">Attempts Log</h1>
      <div className="overflow-x-auto w-full max-w-5xl flex justify-center">
        <table className="table-auto mx-auto border border-gray-200 bg-transparent text-center border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">
                Player Name
              </th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">
                Score
              </th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">
                Doll 1
              </th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">
                Doll 2
              </th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">
                Doll 3
              </th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">
                Doll 4
              </th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">
                Doll 5
              </th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">
                Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a, idx) => (
              <tr
                key={a.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {a.player_name}
                </td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {a.score}
                </td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {a.doll1}
                </td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {a.doll2}
                </td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {a.doll3}
                </td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {a.doll4}
                </td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {a.doll5}
                </td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {a.date}
                </td>
                <td className="px-2 py-1 border-b border-gray-200 text-center">
                  <button
                    onClick={() => handleDeleteClick(a.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {attempts.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No attempts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Export to CSV
        </button>
        <button
          onClick={handleImportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Import CSV
        </button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        <button
          onClick={handleResetDB}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reset Database
        </button>
      </div>
      {importStatus && (
        <div className="mt-2 text-center text-sm text-gray-700">{importStatus}</div>
      )}
      {resetStatus && (
        <div className="mt-2 text-center text-sm text-gray-700">{resetStatus}</div>
      )}
      {confirmId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
            <div className="mb-4 text-gray-800">
              Are you sure you want to delete this attempt?
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
            <div className="mb-4 text-gray-800">
              Are you sure you want to <span className="font-bold text-red-600">reset the database</span>?<br />
              <span className="text-sm text-gray-600">This will delete all data.</span>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmResetDB}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={cancelResetDB}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
