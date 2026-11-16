import React, { useMemo, useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { BodyParamsItem } from '../../types/types';

type Props = {
  allBodyParams: BodyParamsItem[] | null;
};

const ShowDiagram: React.FC<Props> = ({ allBodyParams }) => {
  const dateSet = new Set(
    allBodyParams?.map(item => item.insert_date.split("T")[0]) || []
  );

  const paramNames = useMemo(() => {
    return Array.from(new Set(allBodyParams?.map(item => item.dict_body_params_name) || []));
  }, [allBodyParams]);

  const processedData = useMemo(() => {
    return Array.from(dateSet).sort().map(date => {
      const entry: Record<string, any> = { insert_date: date };
      allBodyParams?.forEach(item => {
        if (item.insert_date.startsWith(date)) {
          entry[item.dict_body_params_name] = item.value;
        }
      });
      return entry;
    });
  }, [allBodyParams]);

  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>({});
  const [showLoader, setShowLoader] = useState(true);

  // Ustawiamy widoczność linii po załadowaniu danych
  useEffect(() => {
    if (paramNames.length > 0) {
      setVisibleLines(
        Object.fromEntries(paramNames.map(name => [name, true]))
      );
    }
  }, [paramNames]);

  useEffect(() => {
    if (!allBodyParams || allBodyParams.length === 0) {
      setShowLoader(true);
      const timer = setTimeout(() => setShowLoader(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [allBodyParams]);

  const toggleLine = (paramName: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [paramName]: !prev[paramName]
    }));
  };

  const colors = [
    "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099",
    "#3B3EAC", "#0099C6", "#DD4477", "#66AA00"
  ];

  return (
    <>
      {(!allBodyParams || allBodyParams.length === 0) ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {showLoader ? <span className="loader" /> : null}
        </div>
      ) : (
        <>
          <div style={{ height: "500px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="insert_date" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
                {paramNames.map((param, index) =>
                  visibleLines[param] && (
                    <Line
                      key={param}
                      type="monotone"
                      dataKey={param}
                      name={param}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      connectNulls={true}
                      dot={{ r: 6 }}
                    />
                  )
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Checkboxy */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1em", marginTop: "1em" }}>
            {paramNames.map((param, index) => (
              <label key={param} style={{ display: "flex", alignItems: "center", gap: "0.5em", color: colors[index % colors.length] }}>
                <input
                  type="checkbox"
                  checked={visibleLines[param]}
                  onChange={() => toggleLine(param)}
                />
                {param}
              </label>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ShowDiagram;
