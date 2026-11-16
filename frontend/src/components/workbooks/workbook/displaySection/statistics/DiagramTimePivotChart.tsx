import React from "react";
import { Chart } from "react-google-charts";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import { useGetTimeMaxTimeAvgTimeForEachExerciseEachTraining } from "../../../../../services/diagrams/DiagramTanstackService";
import { TimeMaxTimeAvgTimeForEachExerciseEachTraining } from '../../../../../types/types';

interface Props {
  workbookId: number;
}

export const DiagramTimePivotChart: React.FC<Props> = ({ workbookId }) => {
  const { data = [], isLoading: loading } = useGetTimeMaxTimeAvgTimeForEachExerciseEachTraining(workbookId);

  // Określenie typu danych w tablicy data
  const categories: string[] = Array.from(new Set(data.map((d: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => d.category)));

  if (loading) return <span className="loader" />;

  return (
    <Tabs>
      <TabList>
        {categories.map((category: string) => (
          <Tab key={category}>{category}</Tab>
        ))}
      </TabList>

      {categories.map((category: string) => {
        const exercises = Array.from(
          new Set(data.filter((d: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => d.category === category).map((d: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => d.exercise))
        );

        return (
          <TabPanel key={String(category)}>
            {exercises.map((exercise) => {
              const exerciseData = data
                .filter((d: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => d.exercise === exercise && d.category === category)
                .sort((a: TimeMaxTimeAvgTimeForEachExerciseEachTraining, b: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => a.date.localeCompare(b.date));

              const chartData = [
                ["Date", "serie 1", "serie 2", "serie 3", "serie 4", "serie 5", "Average", "Max"],
                ...exerciseData.map((d: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => [
                  d.date,
                  d.timeCol01,
                  d.timeCol02,
                  d.timeCol03,
                  d.timeCol04,
                  d.timeCol05,
                  d.timeAvg,
                  d.timeMax,
                ]),
              ];

              const options = {
                animation: {
                  startup: true,
                  duration: 2000,
                },
                title: `${exercise}`,
                titleTextStyle: { color: '#8e7f90' },
                backgroundColor: 'transparent',
                hAxis: {
                  title: "Date",
                  titleTextStyle: { color: '#8e7f90' },
                  textStyle: { color: '#8e7f90' },
                },
                vAxis: {
                  title: "[s]", // czas w sekundach
                  titleTextStyle: { color: '#8e7f90' },
                  textStyle: { color: '#8e7f90' },
                  minValue: 0
                },
                seriesType: "bars",
                series: {
                  0: { color: "#f57c00" },
                  1: { color: "#f57c00" },
                  2: { color: "#f57c00" },
                  3: { color: "#f57c00" },
                  4: { color: "#f57c00" },
                  5: { type: "line", color: "#3366CC" }, // avg
                  6: { type: "line", color: "#800080" },  // max
                },
                legend: { textStyle: { color: '#8e7f90' } },
              };

              return (
                <div key={String(exercise)}
                  style={{
                    marginBottom: "2rem",
                    overflowX: "auto",
                    overflowY: "hidden"
                  }}>
                  <div style={{ minWidth: `${exerciseData.length * 40}px` }}>
                    <Chart
                      chartType="ComboChart"
                      width="100%"
                      height="400px"
                      data={chartData}
                      options={options}
                    />
                  </div>
                </div>
              );
            })}
          </TabPanel>
        );
      })}
    </Tabs>
  );
};
