import React, { useMemo } from "react";
import { Chart } from "react-google-charts";
import { useGetExerciseStats } from "../../../../../../services/diagrams/DiagramTanstackService";
import { ExerciseStats } from "../../../../../../types/types";
import Spinner from "../../../../../../common/Spinner";

interface DiagramProps {
  mesocycleId: string;
}

const Diagram: React.FC<DiagramProps> = ({ mesocycleId }) => {
  const { data: fetchedData = [], isLoading, error } = useGetExerciseStats(mesocycleId);

  const { repetitions, sets, categories } = useMemo(() => {
    if (fetchedData.length === 0) {
      return { repetitions: [], sets: [], categories: [] };
    }

    const uniqueCategories = Array.from(new Set(fetchedData.map((item: ExerciseStats) => item.category)));

    const repetitionsHeaders = ["Order ID", ...uniqueCategories.map(category => `${category} Repetitions`)];
    const setsHeaders = ["Order ID", ...uniqueCategories.map(category => `${category} Sets`)];

    const maxOrderId = fetchedData.length > 0 ? Math.max(...fetchedData.map((item: ExerciseStats) => item.orderId)) : 0;

    const repetitionsData: (string | number | null)[][] = [repetitionsHeaders];
    const setsData: (string | number | null)[][] = [setsHeaders];

    for (let i = 1; i <= maxOrderId; i++) {
      const repRow: (string | number | null)[] = [i];
      const setRow: (string | number | null)[] = [i];

      uniqueCategories.forEach(category => {
        const item = fetchedData.find((data: ExerciseStats) => data.orderId === i && data.category === category);
        repRow.push(item ? item.repetitions : null);
        setRow.push(item ? item.sets : null);
      });

      repetitionsData.push(repRow);
      setsData.push(setRow);
    }

    return { repetitions: repetitionsData, sets: setsData, categories: uniqueCategories };
  }, [fetchedData]);

  const commonChartOptions = {
    backgroundColor: "transparent",
    titleTextStyle: { color: "#8e7f90" },
    hAxis: {
      title: "Order ID",
      titleTextStyle: { color: "#8e7f90" },
      textStyle: { color: "#8e7f90" },
    },
    vAxis: {
      titleTextStyle: { color: "#8e7f90" },
      textStyle: { color: "#8e7f90" },
      minValue: 0,
    },
    legend: { textStyle: { color: "#8e7f90" } },
  };

  const repetitionsOptions = {
    ...commonChartOptions,
    title: "Repetitions per Category",
    vAxis: { ...commonChartOptions.vAxis, title: "Repetitions" },
    series: categories.map(() => ({ lineWidth: 2 })),
  };

  const setsOptions = {
    ...commonChartOptions,
    title: "Sets per Category",
    vAxis: { ...commonChartOptions.vAxis, title: "Sets" },
    series: categories.map(() => ({ lineWidth: 2 })),
  };

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <p style={{ color: "red" }}>Failed to fetch data</p>}
      {!isLoading && !error && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          <div style={{ flex: "1 1 500px", minWidth: "300px", marginBottom: "2rem", overflowX: "auto", overflowY: "hidden" }}>
            <div style={{ minWidth: "300px" }}>
              <Chart
                chartType="LineChart"
                width="100%"
                height="300px"
                data={repetitions}
                options={repetitionsOptions}
              />
            </div>
          </div>
          <div style={{ flex: "1 1 500px", minWidth: "300px", marginBottom: "2rem", overflowX: "auto", overflowY: "hidden" }}>
            <div style={{ minWidth: "300px" }}>
              <Chart
                chartType="LineChart"
                width="100%"
                height="300px"
                data={sets}
                options={setsOptions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Diagram;
