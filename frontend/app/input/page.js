'use client';
import { useState } from "react";

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
    const res = await fetch("http://localhost:5000/add_attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data.message || data.error);
    if (res.ok) setForm({ player_name: "", score: "", doll1: "", doll2: "", doll3: "", doll4: "", doll5: "" });
  };

  return (
    <div>
      <h1>Add Attempt</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Player Name:
          <input name="player_name" value={form.player_name} onChange={handleChange} required />
        </label><br />
        <label>
          Score:
          <input name="score" type="number" value={form.score} onChange={handleChange} required min="0" />
        </label><br />
        <label>
          Doll 1:
          <input name="doll1" value={form.doll1} onChange={handleChange} />
        </label><br />
        <label>
          Doll 2:
          <input name="doll2" value={form.doll2} onChange={handleChange} />
        </label><br />
        <label>
          Doll 3:
          <input name="doll3" value={form.doll3} onChange={handleChange} />
        </label><br />
        <label>
          Doll 4:
          <input name="doll4" value={form.doll4} onChange={handleChange} />
        </label><br />
        <label>
          Doll 5:
          <input name="doll5" value={form.doll5} onChange={handleChange} />
        </label><br />
        <button type="submit" style={{ marginTop: "1.5em", padding: "0.7em 1.5em" }}>Submit</button>
      </form>
      <div style={{ marginTop: "1em" }}>{result}</div>
    </div>
  );
}