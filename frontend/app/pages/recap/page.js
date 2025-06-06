"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/apiConfig";

const columns = [
  { key: "player_name", label: "Player Name" },
  { key: "highest_score", label: "Highest Score" },
  { key: "total_score", label: "Total Score" },
  { key: "most_used_doll", label: "Most Used Doll" },
  { key: "attempts", label: "Count" },
  { key: "participation_rate", label: "Participation Rate" },
  { key: "absolute_efficiency", label: "Absolute Efficiency" },
  { key: "relative_efficiency", label: "Relative Efficiency" },
  { key: "peak_average_gap", label: "Peak-Average Gap" },
];

export default function RecapPage() {
  const [recap, setRecap] = useState([]);
  const [sortKey, setSortKey] = useState("player_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

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
      setSortOrder(key === "player_name" ? "asc" : "desc");
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

  // Helper to format values as in the list
  const formatMetric = (key, value) => {
    if (key === "participation_rate" || key === "absolute_efficiency" || key === "relative_efficiency") {
      return typeof value === "number" ? (value * 100).toFixed(2) + "%" : "";
    }
    if (key === "peak_average_gap") {
      return typeof value === "number" ? value.toFixed(2) : "";
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center">
      <h1 className="gfl-header">Player Recap</h1>
      <div className="gfl-list-container w-full">
        <div className="gfl-list-header">
          {columns.map((col) => (
            <button
              key={col.key}
              className="gfl-list-header-item gfl-list-clickable"
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
                className={`gfl-list-clickable gfl-list-row ${idx % 2 === 0 ? "gfl-list-row-even" : "gfl-list-row-odd"}`}
                onClick={() => setSelectedPlayer(player)}
                style={{ cursor: "pointer" }}
                tabIndex={0}
                role="button"
                aria-label={`Show details for ${player.player_name}`}
              >
                <div className="gfl-list-cell">{player.player_name}</div>
                <div className="gfl-list-cell">{player.highest_score}</div>
                <div className="gfl-list-cell">{player.total_score}</div>
                <div className="gfl-list-cell">{player.most_used_doll}</div>
                <div className="gfl-list-cell">{player.attempts}</div>
                <div className="gfl-list-cell">
                  {typeof player.participation_rate === "number"
                    ? (player.participation_rate * 100).toFixed(2) + "%"
                    : ""}
                </div>
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

      {/* Modal for player details */}
      {selectedPlayer && (
        <div className="gfl-modal-bg" onClick={() => setSelectedPlayer(null)}>
          <div
            className="gfl-modal"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
          >
            <h2 className="text-xl font-bold mb-4">{selectedPlayer.player_name}</h2>
            <div className="text-left space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="font-semibold">Highest Score:</span>
                <span>{selectedPlayer.highest_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total Score:</span>
                <span>{selectedPlayer.total_score}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Most Used Doll:</span>
                <span>{selectedPlayer.most_used_doll}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Count:</span>
                <span>{selectedPlayer.attempts}</span>
              </div>
            </div>
            <button
              className="gfl-btn gfl-btn-blue"
              onClick={() => setSelectedPlayer(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
