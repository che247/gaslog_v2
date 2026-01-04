import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Plot from "react-plotly.js";
import "./component.graph.css";

export const Graph = ({ type }) => {
  const [fuelRecords, setFuelRecords] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/allLogs");
        console.log("Got the fuel records: ", res.data);
        setFuelRecords(res.data);
      } catch (err) {
        console.error(`Unable to get gas stations due to ${err}. Please try again later`);
      }
    })();
  }, []);

  const { x, y } = useMemo(() => {
    if (!fuelRecords) {
      console.log("No fuel records found");
      return { x: [], y: [] };
    }
    console.log("Fuel records recieved: ", fuelRecords);
    return {
      x: fuelRecords.map((r) => r.date),
      y: fuelRecords.map((r) => r.total_cost),
    };
  }, [fuelRecords]);

  const traces = () => {
    switch (type) {
      case "line":
        return [
          {
            x,
            y,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
            name: "Total Cost",
          },
        ];
      case "bar":
        return [
          {
            x,
            y,
            type: "bar",
            marker: { color: "red" },
            name: "Total Cost",
          },
        ];
      case "combo":
        return [
          {
            x,
            y,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
            name: "Total Cost (line)",
          },
          {
            x,
            y,
            type: "bar",
            name: "Total Cost (bar)",
          },
        ];
    }
  };

  return (
    <Plot
      className="graph"
      data={traces()}
      layout={{ title: { text: "Total Cost Over Time" } }}
      useResizeHandler
      style={{ width: "100%" }}
      config={{ responsive: true }}
    />
  );
};
