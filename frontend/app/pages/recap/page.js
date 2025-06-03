'use client';
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
      <h1 className="text-2xl font-bold mb-6 text-center">Player Recap</h1>
      <div className="overflow-x-auto w-full max-w-3xl flex justify-center">
        <table className="table-auto mx-auto border border-gray-200 bg-transparent text-center border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col, idx) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 border-b border-r border-gray-200 text-center cursor-pointer select-none`}
                  onClick={() => handleSort(col.key)}
                  style={idx === columns.length - 1 ? { borderRight: 0 } : {}}
                >
                  {col.label}
                  <span className="ml-1">{sortArrow(col.key)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRecap.map((player, idx) => (
              <tr
                key={player.player_name}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">{player.player_name}</td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">{player.highest_score}</td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">{player.total_score}</td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">{player.attempts}</td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {typeof player.absolute_efficiency === "number"
                    ? (player.absolute_efficiency * 100).toFixed(2) + '%'
                    : ""}
                </td>
                <td className="px-2 py-1 border-b border-r border-gray-200 text-center">
                  {typeof player.relative_efficiency === "number"
                    ? (player.relative_efficiency * 100).toFixed(2) + '%'
                    : ""}
                </td>
                <td className="px-2 py-1 border-b border-gray-200 text-center">
                  {typeof player.peak_average_gap === "number"
                    ? player.peak_average_gap.toFixed(2)
                    : ""}
                </td>
              </tr>
            ))}
            {recap.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                  No player data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleExportCSV}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Export to CSV
      </button>
    </div>
  );
}