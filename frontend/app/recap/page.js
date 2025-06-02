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
    <div style={{ margin: "2em" }}>
      <h1>Player Recap</h1>
      <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "2em" }}>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Highest Score</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {recap.map(player => (
            <tr key={player.player_name}>
              <td>{player.player_name}</td>
              <td>{player.highest_score}</td>
              <td>{player.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}