"use client";
import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/app/apiConfig";

const columns = [
  { key: "player_name", label: "Player Name" },
  { key: "score", label: "Score" },
  { key: "doll1", label: "Doll 1" },
  { key: "doll2", label: "Doll 2" },
  { key: "doll3", label: "Doll 3" },
  { key: "doll4", label: "Doll 4" },
  { key: "doll5", label: "Doll 5" },
  { key: "date", label: "Date" },
  { key: "action", label: "Action" },
];

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
    <div className="gfl-page-center pt-16 pb-5">
      <h1 className="gfl-header">Attempts Log</h1>
      <div className="overflow-x-auto w-full">
        <table className="gfl-table">
          <thead>
            <tr className="gfl-table-header">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`gfl-table-cell font-semibold ${
                    col.key === "action" ? "text-center" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attempts.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                >
                  No attempts found.
                </td>
              </tr>
            ) : (
              attempts.map((a, idx) => (
                <tr
                  key={a.id}
                  className={
                    idx % 2 === 0 ? "gfl-table-row-even" : "gfl-table-row-odd"
                  }
                >
                  <td className="gfl-table-cell">{a.player_name}</td>
                  <td className="gfl-table-cell">{a.score}</td>
                  <td className="gfl-table-cell">{a.doll1}</td>
                  <td className="gfl-table-cell">{a.doll2}</td>
                  <td className="gfl-table-cell">{a.doll3}</td>
                  <td className="gfl-table-cell">{a.doll4}</td>
                  <td className="gfl-table-cell">{a.doll5}</td>
                  <td className="gfl-table-cell">{a.date}</td>
                  <td className="gfl-table-cell text-center">
                    <button
                      onClick={() => handleDeleteClick(a.id)}
                      className="gfl-btn gfl-btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-4">
        <button onClick={handleImportCSV} className="gfl-btn gfl-btn-green">
          Import CSV
        </button>
        <button onClick={handleExportCSV} className="gfl-btn gfl-btn-blue">
          Export to CSV
        </button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }}
        />
        <button onClick={handleResetDB} className="gfl-btn gfl-btn-red">
          Reset Database
        </button>
      </div>
      {importStatus && (
        <div className="mt-2 text-center text-sm text-gray-700">
          {importStatus}
        </div>
      )}
      {resetStatus && (
        <div className="mt-2 text-center text-sm text-gray-700">
          {resetStatus}
        </div>
      )}
      {confirmId !== null && (
        <div className="gfl-modal-bg">
          <div className="gfl-modal">
            <div className="mb-4 text-gray-800">
              Are you sure you want to delete this attempt?
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDelete} className="gfl-btn gfl-btn-red">
                Delete
              </button>
              <button onClick={cancelDelete} className="gfl-btn gfl-btn-gray">
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
              Are you sure you want to{" "}
              <span className="font-bold text-red-600">reset the database</span>
              ?<br />
              <span className="text-sm text-gray-600">
                This will delete all data.
              </span>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={confirmResetDB} className="gfl-btn gfl-btn-red">
                Reset
              </button>
              <button onClick={cancelResetDB} className="gfl-btn gfl-btn-gray">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
