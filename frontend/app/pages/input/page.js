"use client";
import { useState } from "react";
import { API_BASE_URL } from "@/app/apiConfig";

export default function InputPage() {
  const [form, setForm] = useState({
    player_name: "",
    score: "",
    doll1: "",
    doll2: "",
    doll3: "",
    doll4: "",
    doll5: "",
  });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    const res = await fetch(`${API_BASE_URL}/add_attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data.message || data.error);
    if (res.ok)
      setForm({
        player_name: "",
        score: "",
        doll1: "",
        doll2: "",
        doll3: "",
        doll4: "",
        doll5: "",
      });
  };

  return (
    <div className="gfl-page-center">
      <div className="gfl-card">
        <h1 className="gfl-title">Add Attempt</h1>
        <form onSubmit={handleSubmit} className="gfl-form">
          <div>
            <label className="gfl-label" htmlFor="player_name">
              Player Name:
            </label>
            <input
              id="player_name"
              name="player_name"
              value={form.player_name}
              onChange={handleChange}
              required
              className="gfl-input"
            />
          </div>
          <div>
            <label className="gfl-label" htmlFor="score">
              Score:
            </label>
            <input
              id="score"
              name="score"
              type="number"
              value={form.score}
              onChange={handleChange}
              required
              min="0"
              className="gfl-input"
            />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <label className="gfl-label" htmlFor={`doll${i}`}>
                Doll {i}:
              </label>
              <input
                id={`doll${i}`}
                name={`doll${i}`}
                value={form[`doll${i}`]}
                onChange={handleChange}
                className="gfl-input"
              />
            </div>
          ))}
          <button type="submit" className="gfl-btn-submit">
            Submit
          </button>
        </form>
      </div>
      {result && (
        <div className="gfl-modal-bg">
          <div className="gfl-modal">
            <div className="mb-4 text-gray-800">{result}</div>
            <button
              onClick={() => setResult("")}
              className="gfl-modal-btn"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
