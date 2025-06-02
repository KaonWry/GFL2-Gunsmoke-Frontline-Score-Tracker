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
      <div className="overflow-x-auto w-full max-w-3xl">
        <table className="min-w-full border border-gray-200 bg-transparent text-center border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 border-b border-r border-gray-200 text-center">Player Name</th>
              <th className="px-3 py-2 border-b border-r border-gray-200 text-center">Highest Score</th>
              <th className="px-3 py-2 border-b border-gray-200 text-center">Total Score</th>
            </tr>
          </thead>
          <tbody>
            {recap.map(player => (
              <tr key={player.player_name} className="hover:bg-gray-50">
                <td className="px-3 py-2 border-b border-r border-gray-200 text-center">{player.player_name}</td>
                <td className="px-3 py-2 border-b border-r border-gray-200 text-center">{player.highest_score}</td>
                <td className="px-3 py-2 border-b border-gray-200 text-center">{player.total_score}</td>
              </tr>
            ))}
            {recap.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
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