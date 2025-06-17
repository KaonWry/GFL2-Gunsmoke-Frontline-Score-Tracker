"use client";
import { useState } from "react";
import { API_BASE_URL } from "@/app/apiConfig";
import Select from "react-select";

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
  const dollOptions = [
    { value: "Andoris", label: "Andoris" },
    { value: "Belka", label: "Belka" },
    { value: "Centaureissi", label: "Centaureissi" },
    { value: "Daiyan", label: "Daiyan" },
    { value: "Dushevnaya", label: "Dushevnaya" },
    { value: "Faye", label: "Faye" },
    { value: "Florence", label: "Florence" },
    { value: "Jiangyu", label: "Jiangyu" },
    { value: "Klukai", label: "Klukai" },
    { value: "Lainie", label: "Lainie" },
    { value: "Lenna", label: "Lenna" },
    { value: "Leva", label: "Leva" },
    { value: "Makiatto", label: "Makiatto" },
    { value: "Mechty", label: "Mechty" },
    { value: "Mosin-Nagant", label: "Mosin-Nagant" },
    { value: "Nikketa", label: "Nikketa" },
    { value: "Papasha", label: "Papasha" },
    { value: "Peri", label: "Peri" },
    { value: "Peritya", label: "Peritya" },
    { value: "Qiongjiu", label: "Qiongjiu" },
    { value: "Qiuhua", label: "Qiuhua" },
    { value: "Robella", label: "Robella" },
    { value: "Sabrina", label: "Sabrina" },
    { value: "Springfield", label: "Springfield" },
    { value: "Suomi", label: "Suomi" },
    { value: "Tololo", label: "Tololo" },
    { value: "Ullrid", label: "Ullrid" },
    { value: "Vector", label: "Vector" },
    { value: "Vepley", label: "Vepley" },
    { value: "Yoohee", label: "Yoohee" },
    { value: "Zhaohui", label: "Zhaohui" },
    { value: "Cheeta", label: "Cheeta" },
    { value: "Colphne", label: "Colphne" },
    { value: "Groza", label: "Groza" },
    { value: "Krolik", label: "Krolik" },
    { value: "Ksenia", label: "Ksenia" },
    { value: "Littara", label: "Littara" },
    { value: "Lotta", label: "Lotta" },
    { value: "Nagant", label: "Nagant" },
    { value: "Nemesis", label: "Nemesis" },
    { value: "Sharkry", label: "Sharkry" },
  ];

  return (
    <div className="gfl-page-center pt-7">
      <div className="gfl-card">
        <h1 className="gfl-header">Add Attempt</h1>
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <label className="gfl-label" htmlFor={`doll${i}`}>
                Doll {i}:
              </label>
              <Select
                styles={{
                  control: (base, state) => ({
                    ...base,
                    border: "1px solid #000",
                    padding: "4px 8px",
                    borderRadius: "0.375rem",
                    boxShadow: state.isFocused
                      ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                      : "",
                  }),
                }}
                inputId={`doll${i}`}
                name={`doll${i}`}
                options={dollOptions}
                isClearable
                isSearchable
                value={
                  dollOptions.find((opt) => opt.value === form[`doll${i}`]) ||
                  null
                }
                onChange={(selectedOption) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    [`doll${i}`]: selectedOption ? selectedOption.value : "",
                  }))
                }
              />
            </div>
          ))}
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
          <button type="submit" className="gfl-btn-submit">
            Submit
          </button>
        </form>
      </div>
      {result && (
        <div className="gfl-modal-bg" onClick={() => setResult("")}>
          <div className="gfl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 text-gray-800">{result}</div>
            <button onClick={() => setResult("")} className="gfl-modal-btn">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
