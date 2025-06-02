'use client';
import { useEffect, useState } from "react";

export default function RecapPage() {
  const [recap, setRecap] = useState([]);

  const fetchRecap = async () => {
    const res = await fetch("http://localhost:5000/recap_players");
    const data = await res.json();
    setRecap(data);
  };

  useEffect(() => {
    fetchRecap();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-center">Player Recap</h1>
      <div className="overflow-x-auto w-full max-w-3xl flex justify-center">
        <table className="table-auto mx-auto border border-gray-200 bg-transparent text-center border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">Player Name</th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">Highest Score</th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">Total Score</th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">Count</th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">Absolute Efficiency</th>
              <th className="px-6 py-3 border-b border-r border-gray-200 text-center">Relative Efficiency</th>
              <th className="px-6 py-3 border-b border-gray-200 text-center">Peak-Average Gap</th>
            </tr>
          </thead>
          <tbody>
            {recap.map((player, idx) => (
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
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No player data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}