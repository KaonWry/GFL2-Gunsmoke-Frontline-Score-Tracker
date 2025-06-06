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
        <table className="gfl-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="gfl-th">Player Name</th>
              <th className="gfl-th">Score</th>
              <th className="gfl-th">Doll 1</th>
              <th className="gfl-th">Doll 2</th>
              <th className="gfl-th">Doll 3</th>
              <th className="gfl-th">Doll 4</th>
              <th className="gfl-th">Doll 5</th>
              <th className="gfl-th">Date</th>
              <th className="gfl-th">Action</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a, idx) => (
              <tr
                key={a.id}
                className={idx % 2 === 0 ? "gfl-tr-even" : "gfl-tr-odd"}
              >
                <td className="gfl-td">{a.player_name}</td>
                <td className="gfl-td">{a.score}</td>
                <td className="gfl-td">{a.doll1}</td>
                <td className="gfl-td">{a.doll2}</td>
                <td className="gfl-td">{a.doll3}</td>
                <td className="gfl-td">{a.doll4}</td>
                <td className="gfl-td">{a.doll5}</td>
                <td className="gfl-td">{a.date}</td>
                <td className="gfl-td gfl-td-last">
                  <button
                    onClick={() => handleDeleteClick(a.id)}
                    className="gfl-btn gfl-btn-red"
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
          onClick={handleImportCSV}
          className="gfl-btn gfl-btn-green"
        >
          Import CSV
        </button>
        <button
          onClick={handleExportCSV}
          className="gfl-btn gfl-btn-blue"
        >
          Export to CSV
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
          className="gfl-btn gfl-btn-red"
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
        <div className="gfl-modal-bg">
          <div className="gfl-modal">
            <div className="mb-4 text-gray-800">
              Are you sure you want to delete this attempt?
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="gfl-btn gfl-btn-red"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="gfl-btn gfl-btn-gray"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showResetModal && (
        <div className="gfl-modal-bg">
          <div className="gfl-modal">
            <div className="mb-4 text-gray-800">
              Are you sure you want to <span className="font-bold text-red-600">reset the database</span>?<br />
              <span className="text-sm text-gray-600">This will delete all data.</span>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmResetDB}
                className="gfl-btn gfl-btn-red"
              >
                Reset
              </button>
              <button
                onClick={cancelResetDB}
                className="gfl-btn gfl-btn-gray"
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
