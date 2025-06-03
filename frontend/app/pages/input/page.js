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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Attempt</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="player_name"
            >
              Player Name:
            </label>
            <input
              id="player_name"
              name="player_name"
              value={form.player_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="score">
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor={`doll${i}`}
              >
                Doll {i}:
              </label>
              <input
                id={`doll${i}`}
                name={`doll${i}`}
                value={form[`doll${i}`]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors mt-4 font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
      {result && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
            <div className="mb-4 text-gray-800">{result}</div>
            <button
              onClick={() => setResult("")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
