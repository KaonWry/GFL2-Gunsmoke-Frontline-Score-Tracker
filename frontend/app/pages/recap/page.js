"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/apiConfig";

const columns = [
  { key: "player_name", label: "Player Name" },
  { key: "highest_score", label: "Highest Score" },
  { key: "total_score", label: "Total Score" },
  { key: "attempts", label: "Count" },
  { key: "absolute_efficiency", label: "Absolute Efficiency" },
  { key: "relative_efficiency", label: "Relative Efficiency" },
  { key: "peak_average_gap", label: "Peak-Average Gap" },
];

export default function RecapPage() {
  const [recap, setRecap] = useState([]);
  const [sortKey, setSortKey] = useState("player_name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchRecap = async () => {
    const res = await fetch(`${API_BASE_URL}/recap_players`);
    const data = await res.json();
    setRecap(data);
  };

  useEffect(() => {
    fetchRecap();
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleExportCSV = () => {
    window.open(`${API_BASE_URL}/export_csv?table=recap`, "_blank");
  };

  const sortedRecap = [...recap].sort((a, b) => {
    let aValue = a[sortKey];
    let bValue = b[sortKey];

    if (sortKey === "player_name") {
      aValue = aValue?.toLowerCase() || "";
      bValue = bValue?.toLowerCase() || "";
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }

    aValue = typeof aValue === "number" ? aValue : -Infinity;
    bValue = typeof bValue === "number" ? bValue : -Infinity;
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  const sortArrow = (key) => {
    if (sortKey !== key) return "";
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center">
      <h1 className="gfl-header">Player Recap</h1>
      <div className="gfl-list-container w-full">
        <div className="gfl-list-header">
          {columns.map((col) => (
            <button
              key={col.key}
              className="gfl-list-header-item gfl-list-header-item-clickable"
              onClick={() => handleSort(col.key)}
              type="button"
            >
              {col.label}
              <span className="ml-1">{sortArrow(col.key)}</span>
            </button>
          ))}
        </div>
        {sortedRecap.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No player data found.
          </div>
        ) : (
          <div className="gfl-list">
            {sortedRecap.map((player, idx) => (
              <div
                key={player.player_name}
                className={`gfl-list-row ${idx % 2 === 0 ? "gfl-list-row-even" : "gfl-list-row-odd"}`}
              >
                <div className="gfl-list-cell">{player.player_name}</div>
                <div className="gfl-list-cell">{player.highest_score}</div>
                <div className="gfl-list-cell">{player.total_score}</div>
                <div className="gfl-list-cell">{player.attempts}</div>
                <div className="gfl-list-cell">
                  {typeof player.absolute_efficiency === "number"
                    ? (player.absolute_efficiency * 100).toFixed(2) + "%"
                    : ""}
                </div>
                <div className="gfl-list-cell">
                  {typeof player.relative_efficiency === "number"
                    ? (player.relative_efficiency * 100).toFixed(2) + "%"
                    : ""}
                </div>
                <div className="gfl-list-cell">
                  {typeof player.peak_average_gap === "number"
                    ? player.peak_average_gap.toFixed(2)
                    : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={handleExportCSV}
        className="mt-4 gfl-btn gfl-btn-blue"
      >
        Export to CSV
      </button>
    </div>
  );
}
