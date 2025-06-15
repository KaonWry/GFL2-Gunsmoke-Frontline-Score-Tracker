"use client";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/apiConfig";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

const maxAttempts = 2 * 7; // 7 days long event, 2 attempts per day

function CustomTooltip({ active, payload, label, selectedPlayer }) {
  if (active && payload && payload.length && selectedPlayer) {
    const metricKeyMap = {
      Participation: {
        key: "attempts",
        format: (v) => v ?? 0,
      },
      "Absolute Efficiency": {
        key: "absolute_efficiency",
        format: (v) => ((v ?? 0) * 100).toFixed(2) + "%",
      },
      "Relative Efficiency": {
        key: "relative_efficiency",
        format: (v) => ((v ?? 0) * 100).toFixed(2) + "%",
      },
      "Total Score": {
        key: "total_score",
        format: (v) => v ?? 0,
      },
      "Highest Score": {
        key: "highest_score",
        format: (v) => v ?? 0,
      },
      "Peak-Average Gap": {
        key: "peak_average_gap",
        format: (v) => (typeof v === "number" ? v.toFixed(2) : ""),
      },
    };
    const metric = payload[0].payload.metric;
    const map = metricKeyMap[metric];
    const realValue = map
      ? map.format(selectedPlayer[map.key])
      : payload[0].value;
    return (
      <div className="bg-white p-2 rounded shadow text-xs border border-gray-200">
        <div className="font-semibold">{metric}</div>
        <div>{realValue}</div>
      </div>
    );
  }
  return null;
}

function TwoLineTick({ payload, x, y, textAnchor, ...rest }) {
  // Move the label further out from the center
  // Center of chart is at (cx, cy) = (150,120) for default ResponsiveContainer 300x240
  // But we can get cx/cy from props if needed, or just calculate a vector from (150,120) to (x,y)
  // Let's use a scale factor to push the label further out

  // Chart center (cx, cy) must match your RadarChart's cx/cy
  const cx = 150;
  const cy = 120;
  const dx = x - cx;
  const dy = y - cy;
  const scale = 1.1; // Increase for more distance
  const newX = cx + dx * scale;
  const newY = cy + dy * scale;

  const words = payload.value.split(" ");
  if (words.length > 1) {
    return (
      <text x={newX} y={newY} textAnchor={textAnchor} {...rest} fontSize={11}>
        <tspan x={newX} dy="0em">
          {words[0]}
        </tspan>
        <tspan x={newX} dy="1.2em">
          {words.slice(1).join(" ")}
        </tspan>
      </text>
    );
  }
  return (
    <text x={newX} y={newY} textAnchor={textAnchor} {...rest} fontSize={12}>
      {payload.value}
    </text>
  );
}

function CustomLegend() {
  return null;
}

export default function RecapPage() {
  const [recap, setRecap] = useState([]);
  const [sortKey, setSortKey] = useState("player_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Compute max values for normalization
  const maxTotalScore =
    recap.length > 0 ? Math.max(...recap.map((p) => p.total_score || 0)) : 1;
  const maxHighScore =
    recap.length > 0 ? Math.max(...recap.map((p) => p.highest_score || 0)) : 1;
  // For PAG, lower is better. Find the highest PAG (worst) for normalization.
  const maxPAG =
    recap.length > 0
      ? Math.max(
          ...recap.map((p) =>
            typeof p.peak_average_gap === "number"
              ? p.peak_average_gap
              : -Infinity
          )
        )
      : 1;

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
    if (
      key === "participation_rate" ||
      key === "absolute_efficiency" ||
      key === "relative_efficiency"
    ) {
      return typeof value === "number" ? (value * 100).toFixed(2) + "%" : "";
    }
    if (key === "peak_average_gap") {
      return typeof value === "number" ? value.toFixed(2) : "";
    }
    return value;
  };

  // Radar chart data for modal
  const getRadarData = (player) => {
    if (!player) return [];
    // For PAG: 0 (best) => 100, maxPAG (worst) => 0
    let pagScore = 0;
    if (typeof player.peak_average_gap === "number" && maxPAG > 0) {
      pagScore = Math.max(
        0,
        ((maxPAG - player.peak_average_gap) / maxPAG) * 100
      );
    }
    return [
      {
        metric: "Participation",
        value: maxAttempts ? (player.attempts / maxAttempts) * 100 : 0,
        fullMark: 100,
      },
      {
        metric: "Absolute Efficiency",
        value: player.absolute_efficiency
          ? player.absolute_efficiency * 100
          : 0,
        fullMark: 100,
      },
      {
        metric: "Relative Efficiency",
        value: player.relative_efficiency
          ? player.relative_efficiency * 100
          : 0,
        fullMark: 100,
      },
      {
        metric: "Total Score",
        value: maxTotalScore ? (player.total_score / maxTotalScore) * 100 : 0,
        fullMark: 100,
      },
      {
        metric: "Highest Score",
        value: maxHighScore ? (player.highest_score / maxHighScore) * 100 : 0,
        fullMark: 100,
      },
      {
        metric: "Peak-Average Gap",
        value: pagScore,
        fullMark: 100,
      },
    ];
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
                className={`gfl-list-clickable gfl-list-row ${
                  idx % 2 === 0 ? "gfl-list-row-even" : "gfl-list-row-odd"
                }`}
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
      <button onClick={handleExportCSV} className="mt-4 gfl-btn gfl-btn-blue">
        Export to CSV
      </button>

      {/* Modal for player details */}
      {selectedPlayer && (
        <div className="gfl-modal-bg" onClick={() => setSelectedPlayer(null)}>
          <div
            className="gfl-modal gfl-modal-wide"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <h2 className="text-xl font-bold mb-4">
              {selectedPlayer.player_name}
            </h2>
            <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch">
              {/* Left: Stats and Doll Usage Bar */}
              <div className="flex-1 text-left space-y-2 mb-4 md:mb-0 md:mr-4">
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
              {/* Right: Radar Chart */}
              <div className="flex-1 flex items-center justify-center min-w-[220px]">
                <div
                  className="w-full"
                  style={{ minWidth: 220, maxWidth: 320, height: 240 }}
                >
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart
                      data={getRadarData(selectedPlayer)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={<TwoLineTick />} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name={selectedPlayer.player_name}
                        dataKey="value"
                        stroke="#2563eb"
                        fill="#2563eb"
                        fillOpacity={0.5}
                      />
                      <Tooltip
                        content={
                          <CustomTooltip selectedPlayer={selectedPlayer} />
                        }
                      />
                      <Legend content={<CustomLegend />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <button
              className="gfl-btn gfl-btn-blue mt-6"
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
