'use client';
import { useEffect, useState } from "react";

export default function LogPage() {
  const [attempts, setAttempts] = useState([]);

  const fetchAttempts = async () => {
    const res = await fetch("http://localhost:5000/get_attempts");
    const data = await res.json();
    setAttempts(data);
  };

  const deleteAttempt = async (id) => {
    if (!confirm("Are you sure you want to delete this attempt?")) return;
    await fetch(`http://localhost:5000/delete_attempt/${id}`, { method: "DELETE" });
    fetchAttempts();
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  return (
    <div style={{ margin: "2em" }}>
      <h1>Attempts Log</h1>
      <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "2em" }}>
        <thead>
          <tr>
            <th>Player Name</th>
            <th>Score</th>
            <th>Doll 1</th>
            <th>Doll 2</th>
            <th>Doll 3</th>
            <th>Doll 4</th>
            <th>Doll 5</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map(a => (
            <tr key={a.id}>
              <td>{a.player_name}</td>
              <td>{a.score}</td>
              <td>{a.doll1}</td>
              <td>{a.doll2}</td>
              <td>{a.doll3}</td>
              <td>{a.doll4}</td>
              <td>{a.doll5}</td>
              <td>{a.date}</td>
              <td>
                <button onClick={() => deleteAttempt(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}